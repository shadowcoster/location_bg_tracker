import SwiftUI

struct PrimaryButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(AppTypography.button)
      .foregroundStyle(AppColors.ink)
      .frame(maxWidth: .infinity)
      .frame(height: 50)
      .background(AppColors.surface.opacity(configuration.isPressed ? 0.86 : 1))
      .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
  }
}
struct SecondaryButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(AppTypography.button)
  }
}
