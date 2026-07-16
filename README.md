# MovieFlix Assignment

MovieFlix Assignment is a React Native movie browsing app built with Expo SDK 57, TypeScript, React Navigation, NativeWind, and React Native Paper.

The app includes a featured home experience, genre-based browsing, search, a movie details screen, and a profile screen with theme preferences.

## Features

- Featured hero section on the home screen
- Category and genre-based movie browsing
- Search by title or genre
- Movie details screen with cast, director, runtime, and related titles
- Dark mode support through a shared theme context
- Local mock movie dataset with paginated loading behavior

## Tech Stack

- Expo SDK 57
- React Native 0.86
- React 19
- TypeScript
- React Navigation
- NativeWind
- React Native Paper

## Project Structure

```text
src/
  components/     Reusable UI pieces
  constants/      UI strings
  contexts/       App-wide theme state
  data/           Local movie dataset
  hooks/          Data loading hooks
  navigation/     Stack and tab navigators
  screens/        Home, Search, Details, Profile, CategoryList
  services/       Movie service and API fallback logic
  types/          Shared TypeScript types
  utils/          Formatting helpers
```

## Requirements

- Node.js 22.13 or newer
- npm
- For Android development on Windows:
  - Android Studio
  - Android SDK Platform 36
  - Android SDK Build-Tools
  - Android Emulator or a physical Android device
  - JDK 17

Expo SDK 57 targets React Native 0.86 and expects modern Node and Android tooling.

## Setup

1. Install dependencies:

```bash
npm install
```

2. If you want to run Android locally on Windows, make sure Android Studio is installed and configure:

```text
ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
Path += %LOCALAPPDATA%\Android\Sdk\platform-tools
```

3. Confirm ADB is available:

```bash
adb --version
```

## Run The App

Start the Expo development server:

```bash
npm run start
```

If your phone cannot connect over LAN, use tunnel mode:

```bash
npx expo start --tunnel
```

Run on Android with a local native build:

```bash
npm run android
```

Run on web:

```bash
npm run web
```

## Development Notes

- The current app loads movie data from the local dataset in [src/data/movies.ts](src/data/movies.ts).
- [src/services/movieService.ts](src/services/movieService.ts) includes a placeholder TMDB integration, but it is not configured with a real API key.
- The project currently uses the checked-in Android folder locally, but [.gitignore](.gitignore) is configured to ignore `/android` and `/ios` for Git.

## Main Navigation

- Root stack:
  - Bottom tabs
  - Details screen
- Bottom tabs:
  - Home
  - Search
  - Profile
- Home stack:
  - Home
  - CategoryList

## Git Commands

Push this repository to GitHub:

```bash
git add .
git commit -m "Add project README"
git push -u origin main
```

If the remote is not configured yet:

```bash
git remote add origin https://github.com/arup1302/MovieFlix_Assignment.git
git push -u origin main
```

## Status

This project is ready for local development and GitHub publishing.