import SwiftUI

struct NativeGoogleView: View {
  @StateObject private var viewModel: NativeGoogleViewModel
  let onClose: () -> Void

  init(
    viewModel: NativeGoogleViewModel,
    onClose: @escaping () -> Void
  ) {
    _viewModel = StateObject(wrappedValue: viewModel)
    self.onClose = onClose
  }

  var body: some View {
    ZStack {
      AppColors.background
        .ignoresSafeArea()

      ScrollView {
        VStack(alignment: .leading, spacing: AppSpacing.lg) {
          header
          actionGrid
          statusBlock
          responseBlock

          Button("Back to login", action: onClose)
            .buttonStyle(PrimaryButtonStyle())
            .padding(.top, AppSpacing.xs)
        }
        .padding(AppSpacing.lg)
      }
    }
    .navigationTitle("Native API")
    .navigationBarTitleDisplayMode(.inline)
    .toolbar {
      ToolbarItem(placement: .navigationBarLeading) {
        Button("Close", action: onClose)
          .foregroundStyle(AppColors.primaryText)
      }
    }
    .onAppear {
      viewModel.load()
    }
    .alert(
      "Native API issue",
      isPresented: Binding(
        get: { viewModel.errorMessage != nil },
        set: { if !$0 { viewModel.errorMessage = nil } }
      )
    ) {
      Button("OK", role: .cancel) {}
    } message: {
      Text(viewModel.errorMessage ?? "")
    }
  }

  private var header: some View {
    VStack(alignment: .leading, spacing: AppSpacing.sm) {
      Text("JSONPlaceholder API")
        .font(AppTypography.title)
        .foregroundStyle(AppColors.primaryText)

      Text("SwiftUI native screen using MVVM: View -> ViewModel -> Service -> Endpoint -> APIClient.")
        .font(AppTypography.body)
        .foregroundStyle(AppColors.secondaryText)
        .lineSpacing(3)
    }
  }

  private var actionGrid: some View {
    LazyVGrid(columns: [GridItem(.adaptive(minimum: 118), spacing: AppSpacing.sm)], spacing: AppSpacing.sm) {
      apiButton("GET", action: viewModel.runGetExamples)
      apiButton("POST", action: viewModel.runPostExample)
      apiButton("PUT", action: viewModel.runPutExample)
      apiButton("PATCH", action: viewModel.runPatchExample)
      apiButton("DELETE", action: viewModel.runDeleteExample)
      apiButton("Run all", action: viewModel.runAllExamples)
    }
    .disabled(viewModel.isLoading)
    .opacity(viewModel.isLoading ? 0.65 : 1)
  }

  private var statusBlock: some View {
    HStack(spacing: AppSpacing.sm) {
      if viewModel.isLoading {
        ProgressView()
          .tint(AppColors.googleBlue)
      }

      Text(viewModel.lastAction)
        .font(.system(size: 15, weight: .semibold))
        .foregroundStyle(AppColors.primaryText)
    }
    .padding(.vertical, AppSpacing.xs)
  }

  private var responseBlock: some View {
    VStack(alignment: .leading, spacing: AppSpacing.md) {
      postCard(title: "GET detail", post: viewModel.selectedPost)
      postCard(title: "POST response", post: viewModel.createdPost)
      postCard(title: "PUT response", post: viewModel.replacedPost)
      postCard(title: "PATCH response", post: viewModel.patchedPost)

      if let deleteMessage = viewModel.deleteMessage {
        infoCard(title: "DELETE response", message: deleteMessage)
      }

      if !viewModel.posts.isEmpty {
        Text("GET list preview")
          .font(.system(size: 17, weight: .semibold))
          .foregroundStyle(AppColors.primaryText)

        ForEach(Array(viewModel.posts.prefix(3))) { post in
          postRow(post)
        }
      }
    }
  }

  private func apiButton(_ title: String, action: @escaping () -> Void) -> some View {
    Button(action: action) {
      Text(title)
        .font(.system(size: 14, weight: .semibold))
        .frame(maxWidth: .infinity, minHeight: 44)
    }
    .buttonStyle(PrimaryButtonStyle())
  }

  @ViewBuilder
  private func postCard(title: String, post: PlaceholderPost?) -> some View {
    if let post {
      VStack(alignment: .leading, spacing: AppSpacing.xs) {
        Text(title)
          .font(.system(size: 13, weight: .bold))
          .foregroundStyle(AppColors.googleBlue)

        Text("#\(post.apiId ?? 0) \(post.title)")
          .font(.system(size: 16, weight: .semibold))
          .foregroundStyle(AppColors.primaryText)

        Text(post.body)
          .font(.system(size: 14))
          .foregroundStyle(AppColors.secondaryText)
          .lineLimit(3)
      }
      .padding(AppSpacing.md)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(AppColors.surface)
      .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
    }
  }

  private func infoCard(title: String, message: String) -> some View {
    VStack(alignment: .leading, spacing: AppSpacing.xs) {
      Text(title)
        .font(.system(size: 13, weight: .bold))
        .foregroundStyle(AppColors.googleBlue)

      Text(message)
        .font(.system(size: 14, weight: .regular))
        .foregroundStyle(AppColors.primaryText)
    }
    .padding(AppSpacing.md)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(AppColors.surface)
    .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
  }

  private func postRow(_ post: PlaceholderPost) -> some View {
    VStack(alignment: .leading, spacing: 4) {
      Text(post.title)
        .font(.system(size: 14, weight: .semibold))
        .foregroundStyle(AppColors.primaryText)
        .lineLimit(2)

      Text(post.body)
        .font(.system(size: 13))
        .foregroundStyle(AppColors.secondaryText)
        .lineLimit(2)
    }
    .padding(AppSpacing.sm)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(AppColors.surface.opacity(0.7))
    .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
  }
}
