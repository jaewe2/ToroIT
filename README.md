
Framework Utilized: React Native (expo tool as well) for Apps

1. Download Node.js https://nodejs.org/en

2. Download for android app simulator: https://developer.android.com/studio?gad_source=1&gclid=CjwKCAiAiaC-BhBEEiwAjY99qFTDhwjDzDvKSRxfImgqSAaoiw3MmvQTMC9a7LRUWSLPxCXoZXSekBoCJEEQAvD_BwE&gclsrc=aw.ds

3. Download for iOS app simulator: https://apps.apple.com/us/app/xcode/id497799835?mt=12/

4. Visual Studio Code Open Folder:

toroapp

5. start the server/simulator
npx expo start

Reference: https://docs.expo.dev/get-started/start-developing/

6. Join the localhost:
This will be in the terminal (gives ideas of like -a for android studio or -w for web)

7. Optional Sytlization for better looking code (indentation corrections, dark/night themes, coloration of code:
Prettier - formats your code for you
React Native Tools - Microsoft
GitLens - commit to GitHub
JavaScript (ES6) - suggestion for code shortcuts like copilot Expo Tools
ES7 tools as well

8. multiscreen navigation (optional):

npm install @react-navigation/native @react-navigation/stack npm install react-native-screens react-native-safe-area-context cd ios && pod install && cd ..

9. deploy wallet (after funding wallet with test Eth, export MetaMask Private key)
npm run deploy
npm install formik yup (for dependencies and form validation, made easier)


11. Tutorials:
https://www.youtube.com/watch?v=Hp9sTsiTZ_I - reactive native for begineers

https://www.youtube.com/watch?v=1ETOJloLK3Y - create an app with react native 

https://www.youtube.com/watch?v=czhLCGuu_AU - lesson 3 navigation https://www.youtube.com/watch?v=dUVuIJx-RYw - flatlisting

12. all dependencies we need so far:

# Core Expo and React Native dependencies (likely already installed)
npx expo install expo react react-native expo-router

# Navigation dependencies
npx expo install react-native-gesture-handler

# Chatbot dependencies
npm install react-native-gifted-chat axios
npx expo install expo-constants

# UI and icon dependencies
npx expo install @expo/vector-icons expo-image

# Form and validation dependencies
npm install formik yup

# Optional: For environment variables (if using a .env file)
npm install dotenv

# Optional: Development dependencies (if needed for transpiling)
npm install --save-dev @babel/core @babel/preset-env

# Optional: Install Expo CLI globally (if not already installed)
npm install -g expo-cli

# Optional: Clean up unused dependencies (e.g., bad-words)
npm uninstall bad-words
npm prune

#optional: async storage

npx expo install @react-native-async-storage/async-storage

#needed for flash screens:

npx expo install expo expo-font expo-linking expo-splash-screen expo-status-bar expo-system-ui expo-web-browser react react-dom react-native react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens react-native-web @types/react jest-expo
