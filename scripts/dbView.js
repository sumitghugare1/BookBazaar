/**
 * This script helps with database operations using Prisma
 * It provides functions to introspect, generate client, and open Prisma Studio
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const prismaDir = path.join(rootDir, 'prisma');

// Check if Prisma schema exists
if (!fs.existsSync(path.join(prismaDir, 'schema.prisma'))) {
  console.error('Error: Prisma schema not found.');
  console.log('Please run the following commands first:');
  console.log('1. npm run prisma:init - Initialize Prisma');
  console.log('2. npm run prisma:pull - Pull database schema');
  console.log('3. npm run prisma:generate - Generate Prisma client');
  process.exit(1);
}

// Launch Prisma Studio
console.log('🚀 Launching Prisma Studio to view database data...');
const studio = spawn('npx', ['prisma', 'studio'], { stdio: 'inherit' });

studio.on('error', (error) => {
  console.error('Failed to start Prisma Studio:', error.message);
  process.exit(1);
});

console.log('\n📋 Instructions:');
console.log('1. A browser window should open automatically');
console.log('2. If not, go to http://localhost:5555 in your browser');
console.log('3. Use the interface to browse and manage your database data');
console.log('4. Press Ctrl+C to stop the server when finished\n');
