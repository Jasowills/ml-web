const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourceDir = path.join(process.cwd(), '.next/static');
const destDir = path.join(process.cwd(), '.next/standalone/.next');

// Function to copy directory recursively
function copyDirectory(source, destination) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read all items in the source directory
  const items = fs.readdirSync(source);

  // Copy each item
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error('Error: Source directory .next/static does not exist!');
  process.exit(1);
}

// Perform the copy operation
try {
  console.log('Copying static files to standalone output...');
  copyDirectory(sourceDir, destDir);
  console.log('Successfully copied .next/static to .next/standalone/.next/static');
} catch (error) {
  console.error('Error copying files:', error);
  process.exit(1);
}
