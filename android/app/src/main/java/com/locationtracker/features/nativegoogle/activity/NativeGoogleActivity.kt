package com.locationtracker.features.nativegoogle.activity

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import com.locationtracker.features.nativegoogle.viewmodels.NativeGoogleViewModel
import com.locationtracker.features.nativegoogle.views.NativeGoogleScreen

class NativeGoogleActivity : ComponentActivity() {

    private val viewModel: NativeGoogleViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NativeGoogleScreen(
                viewModel = viewModel,
                onClose = { finish() }
            )
        }
    }
}
