package com.locationtracker.features.nativegoogle.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.locationtracker.core.api.APIClient
import com.locationtracker.core.api.APIError
import com.locationtracker.features.nativegoogle.models.PlaceholderPost
import com.locationtracker.features.nativegoogle.models.PlaceholderPostPatchRequest
import com.locationtracker.features.nativegoogle.models.PlaceholderPostRequest
import com.locationtracker.features.nativegoogle.services.PlaceholderService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class NativeGoogleViewModel(
    private val service: PlaceholderService = APIClient.createService(PlaceholderService::class.java)
) : ViewModel() {

    private val _posts = MutableStateFlow<List<PlaceholderPost>>(emptyList())
    val posts: StateFlow<List<PlaceholderPost>> = _posts.asStateFlow()

    private val _selectedPost = MutableStateFlow<PlaceholderPost?>(null)
    val selectedPost: StateFlow<PlaceholderPost?> = _selectedPost.asStateFlow()

    private val _createdPost = MutableStateFlow<PlaceholderPost?>(null)
    val createdPost: StateFlow<PlaceholderPost?> = _createdPost.asStateFlow()

    private val _replacedPost = MutableStateFlow<PlaceholderPost?>(null)
    val replacedPost: StateFlow<PlaceholderPost?> = _replacedPost.asStateFlow()

    private val _patchedPost = MutableStateFlow<PlaceholderPost?>(null)
    val patchedPost: StateFlow<PlaceholderPost?> = _patchedPost.asStateFlow()

    private val _deleteMessage = MutableStateFlow<String?>(null)
    val deleteMessage: StateFlow<String?> = _deleteMessage.asStateFlow()

    private val _lastAction = MutableStateFlow("Ready")
    val lastAction: StateFlow<String> = _lastAction.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    fun load() {
        if (_isLoading.value) return
        viewModelScope.launch {
            perform("GET /posts + GET /posts/1") {
                _posts.value = service.fetchPosts()
                _selectedPost.value = service.fetchPost(1)
            }
        }
    }

    fun runGetExamples() {
        viewModelScope.launch {
            perform("GET examples") {
                _posts.value = service.fetchPosts()
                _selectedPost.value = service.fetchPost(1)
            }
        }
    }

    fun runPostExample() {
        viewModelScope.launch {
            perform("POST /posts") {
                _createdPost.value = service.createPost(
                    PlaceholderPostRequest(
                        userId = 1,
                        title = "Created from native Android",
                        body = "POST sends a new resource body to the server."
                    )
                )
            }
        }
    }

    fun runPutExample() {
        viewModelScope.launch {
            perform("PUT /posts/1") {
                _replacedPost.value = service.replacePost(
                    id = 1,
                    request = PlaceholderPostRequest(
                        userId = 1,
                        title = "Fully replaced from Compose",
                        body = "PUT replaces the complete resource representation."
                    )
                )
            }
        }
    }

    fun runPatchExample() {
        viewModelScope.launch {
            perform("PATCH /posts/1") {
                _patchedPost.value = service.updatePost(
                    id = 1,
                    request = PlaceholderPostPatchRequest(
                        title = "Partially updated title on Android",
                        body = null,
                        userId = null
                    )
                )
            }
        }
    }

    fun runDeleteExample() {
        viewModelScope.launch {
            perform("DELETE /posts/1") {
                service.deletePost(1)
                _deleteMessage.value = "DELETE /posts/1 succeeded. JSONPlaceholder returns an empty object."
            }
        }
    }

    fun runAllExamples() {
        viewModelScope.launch {
            perform("Running all API examples") {
                _posts.value = service.fetchPosts()
                _selectedPost.value = service.fetchPost(1)
                _createdPost.value = service.createPost(
                    PlaceholderPostRequest(userId = 1, title = "Native POST", body = "Created by Compose MVVM.")
                )
                _replacedPost.value = service.replacePost(
                    id = 1,
                    request = PlaceholderPostRequest(userId = 1, title = "Native PUT", body = "Replaced by Compose MVVM.")
                )
                _patchedPost.value = service.updatePost(
                    id = 1,
                    request = PlaceholderPostPatchRequest(title = "Native PATCH", body = null, userId = null)
                )
                service.deletePost(1)
                _deleteMessage.value = "All methods completed: GET, POST, PUT, PATCH, DELETE."
            }
        }
    }

    private suspend fun perform(action: String, operation: suspend () -> Unit) {
        if (_isLoading.value) return
        _isLoading.value = true
        _errorMessage.value = null
        _lastAction.value = action
        try {
            operation()
        } catch (t: Throwable) {
            val apiError = APIError.from(t)
            _errorMessage.value = apiError.message
        } finally {
            _isLoading.value = false
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }
}
