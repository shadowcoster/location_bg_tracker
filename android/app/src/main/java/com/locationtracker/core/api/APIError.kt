package com.locationtracker.core.api

import retrofit2.HttpException
import java.io.IOException

sealed class APIError : Exception() {
    object InvalidURL : APIError()
    object InvalidResponse : APIError()
    data class HttpStatus(val statusCode: Int) : APIError()
    data class DecodingFailed(val throwable: Throwable) : APIError()
    data class Underlying(val throwable: Throwable) : APIError()

    override val message: String?
        get() = when (this) {
            is InvalidURL -> "The API URL is invalid."
            is InvalidResponse -> "The server returned an invalid response."
            is HttpStatus -> "The server returned status code $statusCode."
            is DecodingFailed -> "Failed to decode the response: ${throwable.localizedMessage}"
            is Underlying -> throwable.localizedMessage
        }

    companion object {
        fun from(throwable: Throwable): APIError {
            return when (throwable) {
                is HttpException -> HttpStatus(throwable.code())
                is IOException -> Underlying(throwable)
                is APIError -> throwable
                else -> Underlying(throwable)
            }
        }
    }
}
