package com.locationtracker

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import java.util.concurrent.Executors

class BackgroundLocationService : Service(), LocationListener {
  private lateinit var locationManager: LocationManager
  private val networkExecutor = Executors.newSingleThreadExecutor()

  override fun onCreate() {
    super.onCreate()
    createNotificationChannel()
    locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent?.action == ACTION_STOP) {
      stopTracking()
      return START_NOT_STICKY
    }

    startForeground(NOTIFICATION_ID, createNotification())
    startLocationUpdates()
    return START_STICKY
  }

  private fun startLocationUpdates() {
    if (
      ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) !=
        PackageManager.PERMISSION_GRANTED &&
      ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) !=
        PackageManager.PERMISSION_GRANTED
    ) {
      stopTracking()
      return
    }

    val providers =
      listOf(LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER)
        .filter(locationManager::isProviderEnabled)

    providers.forEach { provider ->
      locationManager.requestLocationUpdates(provider, 3_000L, 3f, this)
    }
  }

  override fun onLocationChanged(location: Location) {
    val preferences = getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
    if (!preferences.getBoolean(KEY_TRACKING, false)) {
      stopTracking()
      return
    }

    val userId = preferences.getString(KEY_USER_ID, null) ?: return
    val apiBaseUrl = preferences.getString(KEY_API_BASE_URL, null) ?: return
    val timestamp =
      SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).run {
        timeZone = TimeZone.getTimeZone("UTC")
        format(Date(location.time))
      }

    emitLocation(userId, location, timestamp)
    networkExecutor.execute {
      postLocation(apiBaseUrl, userId, location, timestamp)
    }
  }

  @Suppress("DEPRECATION")
  override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) = Unit

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onDestroy() {
    locationManager.removeUpdates(this)
    networkExecutor.shutdown()
    super.onDestroy()
  }

  private fun stopTracking() {
    getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
      .edit()
      .putBoolean(KEY_TRACKING, false)
      .apply()
    locationManager.removeUpdates(this)
    stopForeground(STOP_FOREGROUND_REMOVE)
    stopSelf()
  }

  private fun createNotification(): Notification {
    val openIntent = Intent(this, MainActivity::class.java)
    val openPendingIntent =
      PendingIntent.getActivity(
        this,
        0,
        openIntent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )

    val stopIntent = Intent(this, BackgroundLocationService::class.java).setAction(ACTION_STOP)
    val stopPendingIntent =
      PendingIntent.getService(
        this,
        1,
        stopIntent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )

    return NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("Location tracking active")
      .setContentText("Your route is being recorded in the background.")
      .setSmallIcon(android.R.drawable.ic_menu_mylocation)
      .setContentIntent(openPendingIntent)
      .addAction(0, "Stop", stopPendingIntent)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setCategory(NotificationCompat.CATEGORY_SERVICE)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .build()
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    val channel =
      NotificationChannel(
        CHANNEL_ID,
        "Location tracking",
        NotificationManager.IMPORTANCE_LOW,
      ).apply {
        description = "Shown while an active route is being tracked."
        setShowBadge(false)
      }
    getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
  }

  private fun postLocation(
    apiBaseUrl: String,
    userId: String,
    location: Location,
    timestamp: String,
  ) {
    var connection: HttpURLConnection? = null
    try {
      connection =
        URL("${apiBaseUrl.trimEnd('/')}/location").openConnection() as HttpURLConnection
      connection.requestMethod = "POST"
      connection.connectTimeout = 10_000
      connection.readTimeout = 10_000
      connection.doOutput = true
      connection.setRequestProperty("Accept", "application/json")
      connection.setRequestProperty("Content-Type", "application/json")

      val speed = if (location.hasSpeed()) location.speed.toString() else "null"
      val payload =
        """
        {
          "userId": ${jsonString(userId)},
          "latitude": ${location.latitude},
          "longitude": ${location.longitude},
          "accuracy": ${location.accuracy},
          "speed": $speed,
          "source": "gps",
          "timestamp": ${jsonString(timestamp)}
        }
        """.trimIndent()

      connection.outputStream.use { output ->
        output.write(payload.toByteArray(Charsets.UTF_8))
      }
      connection.responseCode
    } catch (_: Exception) {
      // A future location update retries naturally; tracking must remain alive offline.
    } finally {
      connection?.disconnect()
    }
  }

  companion object {
    const val PREFERENCES = "background_location"
    const val KEY_TRACKING = "tracking"
    const val KEY_USER_ID = "user_id"
    const val KEY_API_BASE_URL = "api_base_url"
    const val EVENT_LOCATION = "BackgroundLocationUpdate"
    const val ACTION_STOP = "com.locationtracker.STOP_BACKGROUND_LOCATION"
    private const val CHANNEL_ID = "location_tracking"
    private const val NOTIFICATION_ID = 4101

    @Volatile
    var reactContext: ReactApplicationContext? = null

    private fun emitLocation(userId: String, location: Location, timestamp: String) {
      val context = reactContext
      if (context == null || !context.hasActiveReactInstance()) {
        return
      }

      val payload =
        Arguments.createMap().apply {
          putString("userId", userId)
          putDouble("latitude", location.latitude)
          putDouble("longitude", location.longitude)
          putDouble("accuracy", location.accuracy.toDouble())
          if (location.hasSpeed()) {
            putDouble("speed", location.speed.toDouble())
          }
          putString("source", "gps")
          putString("timestamp", timestamp)
        }
      context
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(EVENT_LOCATION, payload)
    }

    private fun jsonString(value: String): String =
      "\"" +
        value
          .replace("\\", "\\\\")
          .replace("\"", "\\\"")
          .replace("\n", "\\n")
          .replace("\r", "\\r") +
        "\""
  }
}
