# Electron Packaging and Distribution Configuration

## Overview

This document outlines the configuration and setup for packaging and distributing the VidMan application as a desktop application using Electron and electron-builder.

## Configuration Changes

### Package.json Updates

1. **Version Update**: Changed from 0.0.0 to 1.0.0 to indicate a production-ready application
2. **Build Scripts**:
   - Added platform-specific build scripts
   - Created a centralized build script using Node.js
3. **electron-builder Configuration**:
   - Added configuration for all major platforms (Windows, macOS, Linux)
   - Specified appropriate targets for each platform
   - Added icon references for each platform
   - Configured GitHub as the publish provider for future updates

### Vite Configuration

1. **Base Path**: Set to './' for production builds to ensure proper asset loading
2. **Build Options**: Configured for optimal Electron compatibility
3. **Source Maps**: Enabled for development, disabled for production

### Electron Main Process

1. **Environment Detection**: Improved development/production environment detection
2. **Icon Support**: Added platform-specific icon loading
3. **Security**: Maintained necessary security settings for local file access
4. **URL Handling**: Updated URL handling for better cross-platform compatibility

### Build Process

1. **Custom Build Script**: Created a Node.js script (electron/build.js) to:
   - Check for required icon files
   - Handle platform-specific builds
   - Provide better error reporting and user feedback
2. **Icon Instructions**: Added documentation for creating platform-specific icons

## Distribution Targets

### Windows
- NSIS installer (standard Windows installer)
- Portable executable (no installation required)

### macOS
- DMG disk image
- ZIP archive

### Linux
- AppImage (universal Linux package)
- DEB package (Debian, Ubuntu)
- RPM package (Fedora, CentOS)

## Future Considerations

1. **Auto-updates**: The configuration includes GitHub as a publish provider, which can be used with electron-updater to implement automatic updates
2. **Code Signing**: For production releases, code signing should be implemented for Windows and macOS builds
3. **Custom Installers**: For more complex installations, custom NSIS scripts can be added
4. **CI/CD Integration**: The build scripts are designed to work well with CI/CD pipelines
5. **Multi-architecture Support**: Consider adding support for ARM architectures (Apple Silicon, Raspberry Pi)

## Usage Instructions

### Building the Application

```bash
# Build for all platforms
npm run electron:build

# Build for specific platforms
npm run electron:build:win    # Windows only
npm run electron:build:mac    # macOS only
npm run electron:build:linux  # Linux only
```

### Icon Requirements

Before building for production, create the following icon files:

- Windows: `public/icon.ico` (256x256 pixels minimum)
- macOS: `public/icon.icns` (1024x1024 pixels recommended)
- Linux: `public/icon.png` (512x512 pixels recommended)

See `public/icon-instructions.txt` for detailed instructions on creating these icons.

### Publishing Updates

The application is configured to use GitHub as the update provider. To publish updates:

1. Create a GitHub repository for the application
2. Set up GitHub token in your environment
3. Update the `publish` configuration in package.json if needed
4. Run the build with the publish flag: `electron-builder --publish always`

## Implementation Details

### electron-builder Configuration

The electron-builder configuration in package.json includes:

```json
"build": {
  "appId": "com.vidman.app",
  "productName": "VidMan",
  "directories": {
    "output": "dist_electron"
  },
  "files": [
    "dist/**/*",
    "electron/**/*"
  ],
  "mac": {
    "category": "public.app-category.video",
    "target": ["dmg", "zip"],
    "icon": "public/icon.icns"
  },
  "win": {
    "target": ["nsis", "portable"],
    "icon": "public/icon.ico"
  },
  "linux": {
    "target": ["AppImage", "deb", "rpm"],
    "category": "Video",
    "icon": "public/icon.png"
  },
  "publish": {
    "provider": "github"
  }
}
```

### Custom Build Script

The custom build script (electron/build.js) provides:

1. Validation of icon files before building
2. Platform-specific build options
3. Improved error handling and user feedback
4. Consistent build process across environments