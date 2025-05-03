# React Native Expo App Setup Guide

## Prerequisites

Before you can run the app, you will need to install the necessary tools on your system. Follow the steps below to ensure that everything is set up correctly.

### 1. Install [Node.js](https://nodejs.org/)

You will need Node.js, which comes with npm (Node Package Manager), to manage dependencies.

* Go to the [Node.js website](https://nodejs.org/) and download the LTS version.
* Follow the installation instructions and make sure to include npm in the installation process.

### 2. Install [Expo CLI](https://docs.expo.dev/get-started/installation/)

Expo CLI is a tool that helps in developing React Native apps.

* Open PowerShell or Command Prompt and run the following command to install Expo CLI globally:

```bash
npm install -g expo-cli
```

### 3. Install [Git](https://git-scm.com/)

Git is required to clone the repository.

* Go to the [Git website](https://git-scm.com/) and download the latest version for Windows.
* Follow the installation instructions, keeping the default options.

### 4. Install [Android Studio](https://developer.android.com/studio)

To run the app on an Android emulator or a physical Android device, you'll need Android Studio.

* Download and install Android Studio.
* During installation, make sure to select **Android Virtual Device** (AVD) and **Android SDK**.
* After installation, open Android Studio, and in the **SDK Manager**, make sure the **Android SDK** is installed.
* Install the required Android emulators via **AVD Manager** to run the app on an emulator.

### 5. Install [Visual Studio Code (VS Code)](https://code.visualstudio.com/)

VS Code is a popular editor for React Native development.

* Download and install the latest version of VS Code from the official website.
* You can also install the **React Native Tools** extension for enhanced React Native development support in VS Code.

### 6. Install Dependencies

Once you have the necessary tools installed, follow these steps:

1. Clone the repository to your local machine:

```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
cd <project-directory>
```

3. Install the required dependencies using npm:

```bash
npm install
```

### 7. Set up Android Emulator (Optional)

If you don't have a physical Android device, you can use an Android emulator.

* Open **Android Studio** and go to **Tools > AVD Manager** to create a new virtual device.
* Once the emulator is set up, you can run the app on it.

### 8. Running the App

After setting up everything, you can now run the app.

#### Start the Development Server:

* To start the development server and launch the app on an emulator or physical device, run the following command:

```bash
expo start
```

This will open a browser window with the Expo DevTools.

#### Running on a Physical Device:

* If you have the **Expo Go** app installed on your physical Android or iOS device, you can scan the QR code from the Expo DevTools to open the app on your device.

#### Running on an Emulator:

* In the Expo DevTools, click on **Run on Android device/emulator** to launch the app on an emulator.

### 9. Additional Tools (Optional)

* If you are going to develop on iOS as well, you'll need to install [Xcode](https://developer.apple.com/xcode/), which is only available on macOS.
