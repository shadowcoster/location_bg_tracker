package com.locationtracker.features.nativegoogle.views

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.locationtracker.designsystem.AppColors
import com.locationtracker.designsystem.AppSpacing
import com.locationtracker.designsystem.AppTypography
import com.locationtracker.features.nativegoogle.models.PlaceholderPost
import com.locationtracker.features.nativegoogle.viewmodels.NativeGoogleViewModel

@Composable
fun NativeGoogleScreen(
    viewModel: NativeGoogleViewModel,
    onClose: () -> Unit
) {
    val posts by viewModel.posts.collectAsState()
    val selectedPost by viewModel.selectedPost.collectAsState()
    val createdPost by viewModel.createdPost.collectAsState()
    val replacedPost by viewModel.replacedPost.collectAsState()
    val patchedPost by viewModel.patchedPost.collectAsState()
    val deleteMessage by viewModel.deleteMessage.collectAsState()
    val lastAction by viewModel.lastAction.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()

    var showDialog by remember { mutableStateOf(false) }

    LaunchedEffect(errorMessage) {
        if (errorMessage != null) {
            showDialog = true
        }
    }

    if (showDialog && errorMessage != null) {
        AlertDialog(
            onDismissRequest = {
                viewModel.clearErrorMessage()
                showDialog = false
            },
            title = { Text("Native API issue") },
            text = { Text(errorMessage ?: "") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.clearErrorMessage()
                        showDialog = false
                    }
                ) {
                    Text("OK")
                }
            }
        )
    }

    LaunchedEffect(Unit) {
        viewModel.load()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AppColors.Background)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .padding(horizontal = AppSpacing.Md),
                verticalAlignment = Alignment.CenterVertically
            ) {
                TextButton(
                    onClick = onClose,
                    colors = ButtonDefaults.textButtonColors(contentColor = AppColors.PrimaryText)
                ) {
                    Text("Close", fontSize = 16.sp)
                }
                Spacer(modifier = Modifier.width(32.dp))
                Text(
                    text = "Native API",
                    color = AppColors.PrimaryText,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(AppSpacing.Lg),
                verticalArrangement = Arrangement.spacedBy(AppSpacing.Lg)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(AppSpacing.Sm)) {
                    Text(
                        text = "JSONPlaceholder API",
                        style = AppTypography.Title,
                        color = AppColors.PrimaryText
                    )
                    Text(
                        text = "Jetpack Compose native screen using MVVM: View -> ViewModel -> Service -> APIClient.",
                        style = AppTypography.Body,
                        color = AppColors.SecondaryText,
                        lineHeight = 22.sp
                    )
                }

                val actions = listOf(
                    "GET" to { viewModel.runGetExamples() },
                    "POST" to { viewModel.runPostExample() },
                    "PUT" to { viewModel.runPutExample() },
                    "PATCH" to { viewModel.runPatchExample() },
                    "DELETE" to { viewModel.runDeleteExample() },
                    "Run all" to { viewModel.runAllExamples() }
                )

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(110.dp)
                ) {
                    LazyVerticalGrid(
                        columns = GridCells.Adaptive(minimumSize = 100.dp),
                        horizontalArrangement = Arrangement.spacedBy(AppSpacing.Sm),
                        verticalArrangement = Arrangement.spacedBy(AppSpacing.Sm),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(actions) { (title, action) ->
                            Button(
                                onClick = action,
                                enabled = !isLoading,
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = AppColors.Surface,
                                    contentColor = AppColors.Ink,
                                    disabledContainerColor = AppColors.Surface.copy(alpha = 0.65f),
                                    disabledContentColor = AppColors.Ink.copy(alpha = 0.65f)
                                ),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(0.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(44.dp)
                            ) {
                                Text(
                                    text = title,
                                    style = AppTypography.Button
                                )
                            }
                        }
                    }
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(AppSpacing.Sm),
                    modifier = Modifier.padding(vertical = AppSpacing.Xs)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(
                            color = AppColors.GoogleBlue,
                            strokeWidth = 3.dp,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Text(
                        text = lastAction,
                        color = AppColors.PrimaryText,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Column(verticalArrangement = Arrangement.spacedBy(AppSpacing.Md)) {
                    PostCard(title = "GET detail", post = selectedPost)
                    PostCard(title = "POST response", post = createdPost)
                    PostCard(title = "PUT response", post = replacedPost)
                    PostCard(title = "PATCH response", post = patchedPost)

                    deleteMessage?.let { msg ->
                        InfoCard(title = "DELETE response", message = msg)
                    }

                    if (posts.isNotEmpty()) {
                        Text(
                            text = "GET list preview",
                            color = AppColors.PrimaryText,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        posts.take(3).forEach { post ->
                            PostRow(post = post)
                        }
                    }
                }

                Button(
                    onClick = onClose,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = AppColors.Surface,
                        contentColor = AppColors.Ink
                    ),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = AppSpacing.Xs)
                        .height(50.dp)
                ) {
                    Text(text = "Back to login", style = AppTypography.Button)
                }
            }
        }
    }
}

@Composable
fun PostCard(title: String, post: PlaceholderPost?) {
    if (post != null) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFF333333))
                .padding(AppSpacing.Md)
        ) {
            Text(
                text = title,
                color = AppColors.GoogleBlue,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(AppSpacing.Xs))
            Text(
                text = "#${post.apiId ?: 0} ${post.title}",
                color = AppColors.PrimaryText,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(AppSpacing.Xs))
            Text(
                text = post.body,
                color = AppColors.SecondaryText,
                fontSize = 14.sp,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun InfoCard(title: String, message: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(Color(0xFF333333))
            .padding(AppSpacing.Md)
    ) {
        Text(
            text = title,
            color = AppColors.GoogleBlue,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(AppSpacing.Xs))
        Text(
            text = message,
            color = AppColors.PrimaryText,
            fontSize = 14.sp
        )
    }
}

@Composable
fun PostRow(post: PlaceholderPost) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(Color(0xFF333333).copy(alpha = 0.7f))
            .padding(AppSpacing.Sm)
    ) {
        Text(
            text = post.title,
            color = AppColors.PrimaryText,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = post.body,
            color = AppColors.SecondaryText,
            fontSize = 13.sp,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
    }
}
