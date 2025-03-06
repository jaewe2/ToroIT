Framework Utilized: React Native for Apps

1. Download Node.js
https://nodejs.org/en

3. Download for android app simulator:
https://developer.android.com/studio?gad_source=1&gclid=CjwKCAiAiaC-BhBEEiwAjY99qFTDhwjDzDvKSRxfImgqSAaoiw3MmvQTMC9a7LRUWSLPxCXoZXSekBoCJEEQAvD_BwE&gclsrc=aw.ds

4. Download for iOS app simulator:
https://apps.apple.com/us/app/xcode/id497799835?mt=12/

5. Visual Studio Code terminal initializaiton (MyMobileApp is project name, change as you wish):
npx @react-native-community/cli init MyMobileApp
cd MyMobileApp

6. fix any ios that appear errors:

sudo xcodebuild -license accept (for system settings license agreement if you did open xcode before doing all this random stuff)

brew install rbenv
rbenv install 3.2.2
rbenv global 3.2.2
gem install cocoapods
cd ios
pod install
cd ..
npx react-native run-ios

6. start the app via visual studio code


npx react-native start (use metro bundler, make sure the simulator is open, like xcode or android studio)

npx react-native run-ios (ios command)

npx react-native run-android (andorid command)

6. Optional Sytlization for better looking code (indentation corrections, dark/night themes, coloration of code:
Prettier - formats your code for you 
React Native Tools - Microsoft
GitLens - commit to GitHub
JavaScript (ES6) - suggestion for code shortcuts like copilot

7. multiscreen navigation (optional):

npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
cd ios && pod install && cd ..



