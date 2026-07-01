import UIKit
import CoreLocation
import UserNotifications
import FirebaseCore
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()
    BackgroundLocationManager.shared.restoreIfNeeded()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "LocationTracker",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

private final class BackgroundLocationManager:
  NSObject,
  CLLocationManagerDelegate,
  UNUserNotificationCenterDelegate
{
  static let shared = BackgroundLocationManager()

  private let manager = CLLocationManager()
  private let session = URLSession(configuration: .default)
  private let defaults = UserDefaults.standard
  private weak var emitter: BackgroundLocation?

  private let trackingKey = "background_location_tracking"
  private let userIdKey = "background_location_user_id"
  private let apiBaseUrlKey = "background_location_api_base_url"
  private let notificationId = "location-tracking-active"

  override private init() {
    super.init()
    manager.delegate = self
    manager.desiredAccuracy = kCLLocationAccuracyBest
    manager.distanceFilter = 3
    manager.activityType = .fitness
    manager.pausesLocationUpdatesAutomatically = false
    manager.allowsBackgroundLocationUpdates = true
    manager.showsBackgroundLocationIndicator = true
    UNUserNotificationCenter.current().delegate = self
  }

  func attachEmitter(_ emitter: BackgroundLocation) {
    self.emitter = emitter
  }

  func start(userId: String, apiBaseUrl: String) {
    defaults.set(true, forKey: trackingKey)
    defaults.set(userId, forKey: userIdKey)
    defaults.set(apiBaseUrl, forKey: apiBaseUrlKey)

    manager.requestAlwaysAuthorization()
    manager.startUpdatingLocation()
    manager.startMonitoringSignificantLocationChanges()
    showTrackingNotification()
  }

  func stop() {
    defaults.set(false, forKey: trackingKey)
    manager.stopUpdatingLocation()
    manager.stopMonitoringSignificantLocationChanges()
    UNUserNotificationCenter.current()
      .removeDeliveredNotifications(withIdentifiers: [notificationId])
    UNUserNotificationCenter.current()
      .removePendingNotificationRequests(withIdentifiers: [notificationId])
  }

  func isTracking() -> Bool {
    defaults.bool(forKey: trackingKey)
  }

  func restoreIfNeeded() {
    guard isTracking() else { return }
    manager.startUpdatingLocation()
    manager.startMonitoringSignificantLocationChanges()
    showTrackingNotification()
  }

  func locationManager(
    _ manager: CLLocationManager,
    didUpdateLocations locations: [CLLocation]
  ) {
    guard
      isTracking(),
      let location = locations.last,
      let userId = defaults.string(forKey: userIdKey),
      let apiBaseUrl = defaults.string(forKey: apiBaseUrlKey)
    else {
      return
    }

    let timestamp = ISO8601DateFormatter().string(from: location.timestamp)
    let payload: [String: Any] = [
      "userId": userId,
      "latitude": location.coordinate.latitude,
      "longitude": location.coordinate.longitude,
      "accuracy": location.horizontalAccuracy,
      "speed": max(location.speed, 0),
      "source": "gps",
      "timestamp": timestamp,
    ]

    emitter?.sendLocation(payload)
    postLocation(payload: payload, apiBaseUrl: apiBaseUrl)
  }

  func locationManager(
    _ manager: CLLocationManager,
    didFailWithError error: Error
  ) {
    emitter?.sendError(error.localizedDescription)
  }

  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler:
      @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.banner, .list])
  }

  private func postLocation(payload: [String: Any], apiBaseUrl: String) {
    guard
      let url = URL(
        string: "\(apiBaseUrl.trimmingCharacters(in: CharacterSet(charactersIn: "/")))/location"
      ),
      let body = try? JSONSerialization.data(withJSONObject: payload)
    else {
      return
    }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.httpBody = body
    request.timeoutInterval = 10
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("application/json", forHTTPHeaderField: "Accept")
    session.dataTask(with: request).resume()
  }

  private func showTrackingNotification() {
    let center = UNUserNotificationCenter.current()
    center.requestAuthorization(options: [.alert, .sound]) { _, _ in }

    let content = UNMutableNotificationContent()
    content.title = "Location tracking active"
    content.body = "Your route is being recorded in the background."
    content.sound = nil

    center.add(
      UNNotificationRequest(
        identifier: notificationId,
        content: content,
        trigger: nil
      )
    )
  }
}

@objc(BackgroundLocation)
final class BackgroundLocation: RCTEventEmitter {
  private var hasListeners = false

  override init() {
    super.init()
    BackgroundLocationManager.shared.attachEmitter(self)
  }

  @objc
  override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func supportedEvents() -> [String] {
    ["BackgroundLocationUpdate", "BackgroundLocationError"]
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  func sendLocation(_ location: [String: Any]) {
    guard hasListeners else { return }
    sendEvent(withName: "BackgroundLocationUpdate", body: location)
  }

  func sendError(_ message: String) {
    guard hasListeners else { return }
    sendEvent(withName: "BackgroundLocationError", body: message)
  }

  @objc(start:apiBaseUrl:resolver:rejecter:)
  func start(
    _ userId: String,
    apiBaseUrl: String,
    resolver: RCTPromiseResolveBlock,
    rejecter: RCTPromiseRejectBlock
  ) {
    BackgroundLocationManager.shared.start(userId: userId, apiBaseUrl: apiBaseUrl)
    resolver(nil)
  }

  @objc(stop:rejecter:)
  func stop(
    _ resolver: RCTPromiseResolveBlock,
    rejecter: RCTPromiseRejectBlock
  ) {
    BackgroundLocationManager.shared.stop()
    resolver(nil)
  }

  @objc(isTracking:rejecter:)
  func isTracking(
    _ resolver: RCTPromiseResolveBlock,
    rejecter: RCTPromiseRejectBlock
  ) {
    resolver(BackgroundLocationManager.shared.isTracking())
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
