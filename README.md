# Location Tracker

React Native map tracking with live GPS, route history, and a development-only
joystick. An Express/MongoDB API is included under `server/`.

## Configuration

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Start MongoDB and run `npm run server`.
3. Run `bundle exec pod install` in `ios/` after installing native packages.
4. Start the app with `npm run android` or `npm run ios`.

Development builds use `http://10.0.2.2:3000` on the Android emulator and
`http://localhost:3000` on the iOS simulator. The public Mapbox runtime token
is configured in `src/config/mapbox.ts`. Replace
`LOCATION_API_BASE_URL` in `src/services/locationApi.ts` with your HTTPS API
URL for release builds and physical devices.

The joystick UI is compiled only into development behavior through `__DEV__`.
The API separately rejects `source: "joystick"` in production unless
`ENABLE_MOCK_LOCATION=true`.

Live GPS uses native background tracking:

- Android runs a foreground location service with a persistent notification
  and a Stop action. It continues when the app is swiped away.
- iOS uses Always location authorization, background location mode, significant
  location changes, the system background-location indicator, and a local
  tracking notification. iOS does not provide Android-style non-dismissible
  ongoing notifications, so users can dismiss the notification while the
  system location indicator remains authoritative. iOS may relaunch after
  system termination for a significant location change, but Apple does not
  allow tracking after the user explicitly force-quits the app.
- Android also cannot continue after the user chooses Force stop in system
  settings; this is an operating-system security boundary.

The demo screen uses `demo-user` as its user ID. Replace it with the signed-in
user ID when authentication is connected.

---

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
