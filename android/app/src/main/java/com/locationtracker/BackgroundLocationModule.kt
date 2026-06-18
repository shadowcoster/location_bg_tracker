package com.locationtracker

import android.content.Context
import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BackgroundLocationModule(
  private val context: ReactApplicationContext,
) : ReactContextBaseJavaModule(context) {

  init {
    BackgroundLocationService.reactContext = context
  }

  override fun getName(): String = "BackgroundLocation"

  @ReactMethod
  fun start(userId: String, apiBaseUrl: String, promise: Promise) {
    context
      .getSharedPreferences(BackgroundLocationService.PREFERENCES, Context.MODE_PRIVATE)
      .edit()
      .putBoolean(BackgroundLocationService.KEY_TRACKING, true)
      .putString(BackgroundLocationService.KEY_USER_ID, userId)
      .putString(BackgroundLocationService.KEY_API_BASE_URL, apiBaseUrl)
      .apply()

    val intent = Intent(context, BackgroundLocationService::class.java)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      context.startForegroundService(intent)
    } else {
      context.startService(intent)
    }
    promise.resolve(null)
  }

  @ReactMethod
  fun stop(promise: Promise) {
    context
      .getSharedPreferences(BackgroundLocationService.PREFERENCES, Context.MODE_PRIVATE)
      .edit()
      .putBoolean(BackgroundLocationService.KEY_TRACKING, false)
      .apply()
    context.stopService(Intent(context, BackgroundLocationService::class.java))
    promise.resolve(null)
  }

  @ReactMethod
  fun isTracking(promise: Promise) {
    val tracking =
      context
        .getSharedPreferences(BackgroundLocationService.PREFERENCES, Context.MODE_PRIVATE)
        .getBoolean(BackgroundLocationService.KEY_TRACKING, false)
    promise.resolve(tracking)
  }

  @ReactMethod
  fun addListener(eventName: String) = Unit

  @ReactMethod
  fun removeListeners(count: Double) = Unit
}
