package com.locationtracker.features.nativegoogle.models

data class PlaceholderPostRequest(
    val userId: Int,
    val title: String,
    val body: String
)

data class PlaceholderPostPatchRequest(
    val title: String?,
    val body: String?,
    val userId: Int?
)
