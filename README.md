# Video Collection Manager

A modern web application for managing video collections built with React, Vite, and TailwindCSS.

## Features

- Modern UI with Radix UI components
- Responsive design using TailwindCSS
- Fast development environment with Vite

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React context providers
│   ├── lib/           # Utility functions and configurations
│   ├── App.jsx        # Main App component
│   ├── main.jsx       # Application entry point
│   └── index.css      # Global styles
├── public/            # Static assets
└── index.html         # HTML entry point
```

## Technologies Used

- React 18
- Vite 5
- TailwindCSS 3
- Radix UI Components
- PostCSS
- TypeScript support

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
