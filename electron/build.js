const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

// Ensure the dist_electron directory exists
const distElectronDir = path.join(__dirname, '../dist_electron');
if (!fs.existsSync(distElectronDir)) {
  fs.mkdirSync(distElectronDir, { recursive: true });
}

// Check if icons exist, if not, warn the user
const iconChecks = [
  { platform: 'Windows', file: '../public/icon.ico' },
  { platform: 'macOS', file: '../public/icon.icns' },
  { platform: 'Linux', file: '../public/icon.png' }
];

let missingIcons = false;
iconChecks.forEach(check => {
  const iconPath = path.join(__dirname, check.file);
  if (!fs.existsSync(iconPath)) {
    console.warn(`⚠️ Warning: Icon for ${check.platform} not found at ${check.file}`);
    missingIcons = true;
  }
});

if (missingIcons) {
  console.log('📝 Please create the missing icons before building for production.');
  console.log('   See public/icon-instructions.txt for details.');
}

// Get command line arguments
const args = process.argv.slice(2);
const platforms = [];

if (args.includes('--win')) platforms.push('win');
if (args.includes('--mac')) platforms.push('mac');
if (args.includes('--linux')) platforms.push('linux');
if (args.includes('--all') || platforms.length === 0) {
  platforms.push('win', 'mac', 'linux');
}

// Build for each platform
console.log(`🚀 Building ${packageJson.name} v${packageJson.version} for: ${platforms.join(', ')}`);
console.log('📦 Running Vite build...');

try {
  // Build the Vite app
  execSync('npm run build', { stdio: 'inherit' });
  
  // Build Electron app for each platform
  const platformFlags = platforms.map(p => `--${p}`).join(' ');
  console.log(`🔧 Building Electron app for: ${platforms.join(', ')}...`);
  execSync(`electron-builder ${platformFlags}`, { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log(`📂 Output directory: ${distElectronDir}`);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}