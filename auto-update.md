# Auto-Update Functionality in VidMan

This document explains how the automatic update system works in VidMan and how to configure it for your needs.

## Overview

VidMan uses Electron's built-in auto-update capabilities through the `electron-updater` package. This allows the application to:

1. Check for updates automatically on startup
2. Download updates in the background
3. Notify users when updates are available
4. Install updates automatically when the application restarts

## How It Works

### Update Process

1. **Check for Updates**: When the application starts, it automatically checks for updates from the configured update server (GitHub by default).
2. **Download Updates**: If an update is available, it can be downloaded automatically in the background.
3. **Notify User**: The user is notified when an update is available and when it has been downloaded.
4. **Install Updates**: The user can choose to install the update immediately (which will restart the application) or later.

### User Interface

The update notification appears as a non-intrusive popup in the bottom-right corner of the application. It provides:

- Information about the update status
- Download progress when an update is being downloaded
- Buttons to download, install, or dismiss the notification

## Configuration

### Publishing Provider

VidMan is configured to use GitHub as the publishing provider. This is defined in the `package.json` file:

```json
"build": {
  "publish": {
    "provider": "github"
  }
}
```

### Auto-Update Settings

The auto-update settings are configured in `electron/main.js`:

```javascript
// Configure auto updater
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true
```

These settings can be modified to change the behavior of the auto-update system:

- `autoUpdater.autoDownload`: Whether to automatically download updates when they are available
- `autoUpdater.autoInstallOnAppQuit`: Whether to automatically install updates when the application quits

## Publishing Updates

To publish updates that can be automatically detected and installed by users:

1. **Update Version Number**: Update the version number in `package.json`.
2. **Build the Application**: Run `npm run electron:build` to build the application for all platforms.
3. **Create a GitHub Release**: 
   - Create a new release on GitHub
   - Tag it with the version number (e.g., `v1.0.1`)
   - Upload the built application files to the release
4. **Publish the Release**: Once published, users will be notified of the update the next time they start the application.

## Testing Updates

To test the auto-update functionality during development:

1. Build and release version 1.0.0 of your application
2. Update the version in `package.json` to 1.0.1
3. Build the application again
4. Create a GitHub release for version 1.0.1
5. Start the 1.0.0 version of the application and verify that it detects and downloads the update

## Troubleshooting

### Logging

Auto-update logs are saved to the application's log file using `electron-log`. You can find these logs at:

- **Windows**: `%USERPROFILE%\AppData\Roaming\VidMan\logs\main.log`
- **macOS**: `~/Library/Logs/VidMan/main.log`
- **Linux**: `~/.config/VidMan/logs/main.log`

### Common Issues

1. **Updates Not Detected**: 
   - Ensure the GitHub release is properly tagged with the version number
   - Check that the version in `package.json` is higher than the currently installed version
   - Verify that the application has internet access

2. **Download Failures**:
   - Check the logs for specific error messages
   - Ensure the GitHub release assets are properly uploaded and accessible

3. **Installation Failures**:
   - On Windows, ensure the user has sufficient permissions to update the application
   - On macOS, ensure the application is properly signed and notarized

## Advanced Configuration

For more advanced configuration options, refer to the [electron-updater documentation](https://www.electron.build/auto-update).

You can customize:

- Update check frequency
- Custom update servers
- Update notification behavior
- Code signing requirements
- And more

## Security Considerations

- Always sign your application to ensure the authenticity of updates
- Use HTTPS for update servers to prevent man-in-the-middle attacks
- Consider implementing update verification to ensure updates are from a trusted source