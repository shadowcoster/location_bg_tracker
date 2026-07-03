package com.locationtracker.features.nativegoogle.models

import com.google.gson.annotations.SerializedName

data class PlaceholderPost(
    val userId: Int?,
    @SerializedName("id") val apiId: Int?,
    val title: String,
    val body: String
) {
    val id: Int
        get() = apiId ?: -1
}
