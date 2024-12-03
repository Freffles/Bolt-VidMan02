# VidMan - Video Collection Manager

A modern desktop application for managing your local video collection, built with Electron and React.

## Features

- 📁 Local Video Management
  - Scan and manage your local video collection
  - Parse NFO files for video metadata
  - Automatic metadata enrichment from TMDB
  - Support for movie posters and fanart

- 🎬 Video Organization
  - Grid-based video browser
  - Filter by favorites and watch later
  - Genre-based organization
  - Clean, modern interface

- 🎨 User Experience
  - Dark/Light theme support
  - Responsive design
  - Quick video search
  - Sidebar navigation

## Tech Stack

- Frontend: React + Vite
- Desktop: Electron
- Styling: Tailwind CSS
- State Management: React Context
- API Integration: TMDB API v3
- Build Tool: electron-builder

## Development

### Prerequisites

- Node.js 16+
- npm or yarn
- TMDB API key

### Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd vidman
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

4. Start the development server:
```bash
npm run electron:dev
```

### Build

To create a production build:
```bash
npm run electron:build
```

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
