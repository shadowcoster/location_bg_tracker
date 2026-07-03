package com.locationtracker.bridge

import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.locationtracker.features.nativegoogle.activity.NativeGoogleActivity

class NativeGoogleScreenModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NativeGoogleScreen"

    @ReactMethod
    fun open(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity does not exist")
            return
        }
        val intent = Intent(activity, NativeGoogleActivity::class.java)
        activity.startActivity(intent)
        promise.resolve(null)
    }
}
