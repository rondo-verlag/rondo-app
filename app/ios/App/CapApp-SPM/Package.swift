// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.1.0"),
        .package(name: "CapacitorApp", path: "../../../node_modules/@capacitor/app"),
        .package(name: "CapacitorHaptics", path: "../../../node_modules/@capacitor/haptics"),
        .package(name: "CapacitorKeyboard", path: "../../../node_modules/@capacitor/keyboard"),
        .package(name: "CapacitorPreferences", path: "../../../node_modules/@capacitor/preferences"),
        .package(name: "CapacitorScreenOrientation", path: "../../../node_modules/@capacitor/screen-orientation"),
        .package(name: "CapacitorStatusBar", path: "../../../node_modules/@capacitor/status-bar"),
        .package(name: "CordovaPluginInsomnia", path: "../../capacitor-cordova-ios-plugins/sources/CordovaPluginInsomnia"),
        .package(name: "CordovaPluginPurchase", path: "../../capacitor-cordova-ios-plugins/sources/CordovaPluginPurchase"),
        .package(name: "CordovaPluginScreenOrientation", path: "../../capacitor-cordova-ios-plugins/sources/CordovaPluginScreenOrientation"),
        .package(name: "Es6PromisePlugin", path: "../../capacitor-cordova-ios-plugins/sources/Es6PromisePlugin")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorApp", package: "CapacitorApp"),
                .product(name: "CapacitorHaptics", package: "CapacitorHaptics"),
                .product(name: "CapacitorKeyboard", package: "CapacitorKeyboard"),
                .product(name: "CapacitorPreferences", package: "CapacitorPreferences"),
                .product(name: "CapacitorScreenOrientation", package: "CapacitorScreenOrientation"),
                .product(name: "CapacitorStatusBar", package: "CapacitorStatusBar"),
                .product(name: "CordovaPluginInsomnia", package: "CordovaPluginInsomnia"),
                .product(name: "CordovaPluginPurchase", package: "CordovaPluginPurchase"),
                .product(name: "CordovaPluginScreenOrientation", package: "CordovaPluginScreenOrientation"),
                .product(name: "Es6PromisePlugin", package: "Es6PromisePlugin")
            ]
        )
    ]
)
