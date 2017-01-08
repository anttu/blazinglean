Blazing Lean
========

React Native Android app for displaying Withings measurements as graphs

#### React Native Command Line Tools
```
npm install -g react-native-cli
```

#### Command line PATHs
Add these to your bash profile:
```
# Android
export ANDROID_HOME=~/Library/Android/sdk
export PATH=${PATH}:~/Library/Android/sdk/tools:~/Library/Android/sdk/platform-tools
```

### Starting the app on Android

```
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000
react-native start
react-native run-android
```

Tail the logs:
```
adb logcat *:S ReactNative:V ReactNativeJS:V
```

Open the debug console on Android:
```
ctrl+m
```
