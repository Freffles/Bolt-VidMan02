# VidMan - Video Collection Manager

A desktop application for managing your video collection, built with React, Vite, and Electron.

## Features

- Browse and manage local video files
- Play videos directly in the application
- Organize videos by genre
- Search and filter your video collection
- Light and dark theme support
- Automatic updates

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/video-collection-manager.git
cd video-collection-manager

# Install dependencies
npm install
```

### Development Scripts

```bash
# Run the Vite development server
npm run dev

# Run the Electron app in development mode
npm run electron:dev

# Lint the code
npm run lint

# Preview the production build
npm run preview

# Preview the Electron app
npm run electron:preview
```

## Building for Production

### Building for All Platforms

```bash
# Build for all platforms (Windows, macOS, Linux) 
npm run electron:build
```

### Building for Specific Platforms

```bash
# Build for Windows
npm run electron:build:win

# Build for macOS
npm run electron:build:mac

# Build for Linux
npm run electron:build:linux

# Or use the general build command with platform flags
npm run electron:build -- --win --mac
```

The packaged applications will be available in the `dist_electron` directory.

## Auto-Update Functionality

VidMan includes automatic update functionality using electron-updater:

- The application checks for updates on startup
- Users are notified when updates are available
- Updates can be downloaded in the background
- The application can automatically install updates on restart

### Publishing Updates

The application is configured to use GitHub as the update provider. To publish updates:

1. Create a new GitHub release with a tag matching your version number (e.g., `v1.0.1`)
2. Upload the built application files to the release
3. Users will automatically be notified of the new version

### Configuration

The auto-update configuration is defined in:
- `package.json` - Publishing provider configuration
- `electron/main.js` - Auto-update initialization and event handling

## Packaging Configuration

The application is configured to build for multiple platforms using electron-builder. The configuration is defined in the `build` field of `package.json`.

### Icons

Before building for production, make sure to create the following icon files:

- Windows: `public/icon.ico`
- macOS: `public/icon.icns`
- Linux: `public/icon.png`

See `public/icon-instructions.txt` for details on creating these icons.

## Tech Stack

- Frontend: React + Vite
- Desktop: Electron
- Styling: Tailwind CSS
- State Management: React Context
- API Integration: TMDB API v3
- Build Tool: electron-builder
- Auto-updates: electron-updater

## Folder Structure

- `/src` - React application source
  - `/components` - React components
  - `/contexts` - React context providers
  - `/lib` - Utility functions and API clients
- `/electron` - Electron main process files
  - `main.js` - Main process entry
  - `preload.js` - Preload scripts

## Video Folder Structure

The application expects your video collection to follow this structure:
```
Video Folder/
├── Movie Name (Year)/
│   ├── movie.nfo
│   ├── poster.jpg
│   ├── fanart.jpg
│   └── video file
```

## NFO File Support

Supports the following metadata from NFO files:
- Movie title and year
- Plot and tagline
- Rating and runtime
- Genres and certification
- Cast information
- Video/audio stream details

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
