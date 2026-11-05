# Applying this to fodx-scanner (Windows, PowerShell)

1. Work on a branch:   git checkout -b foundation
2. Delete template leftovers at the repo ROOT (keep node_modules, .git):
   components/  constants/  hooks/  scripts/  app/  (only if they exist and src/ is your real source)
3. Copy from this zip into the repo, overwriting:
   src/   assets/images/   app.json   tsconfig.json   babel.config.js
4. Install dependencies (these pick the versions matching SDK 58):
   npx expo install expo-sqlite expo-document-picker expo-image-picker expo-localization expo-haptics react-native-svg react-native-worklets
   npm install pdf-lib i18next react-i18next
   npm uninstall expo-camera expo-build-properties
5. npx expo install --check      (fix anything it lists)
6. npx tsc --noEmit
7. Build and run on your phone (USB debugging on):
   npx expo run:android
