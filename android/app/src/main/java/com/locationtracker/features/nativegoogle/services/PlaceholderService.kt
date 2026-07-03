package com.locationtracker.features.nativegoogle.services

import com.locationtracker.features.nativegoogle.models.PlaceholderPost
import com.locationtracker.features.nativegoogle.models.PlaceholderPostRequest
import com.locationtracker.features.nativegoogle.models.PlaceholderPostPatchRequest
import retrofit2.http.*

interface PlaceholderService {
    @GET("posts")
    suspend fun fetchPosts(): List<PlaceholderPost>

    @GET("posts/{id}")
    suspend fun fetchPost(@Path("id") id: Int): PlaceholderPost

    @POST("posts")
    suspend fun createPost(@Body request: PlaceholderPostRequest): PlaceholderPost

    @PUT("posts/{id}")
    suspend fun replacePost(@Path("id") id: Int, @Body request: PlaceholderPostRequest): PlaceholderPost

    @PATCH("posts/{id}")
    suspend fun updatePost(@Path("id") id: Int, @Body request: PlaceholderPostPatchRequest): PlaceholderPost

    @DELETE("posts/{id}")
    suspend fun deletePost(@Path("id") id: Int): retrofit2.Response<Unit>
}
