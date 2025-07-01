const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting NestJS API Server...');
console.log('Current working directory:', process.cwd());
console.log('Node version:', process.version);

// Start the NestJS application
const child = spawn('node', ['dist/main.js'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: { ...process.env, NODE_ENV: 'development' }
});

child.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
});

child.on('exit', (code, signal) => {
  if (code === 0) {
    console.log('✅ Server exited successfully');
  } else {
    console.error(`❌ Server exited with code ${code} and signal ${signal}`);
  }
});

child.on('close', (code) => {
  console.log(`Server process closed with code ${code}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  child.kill('SIGTERM');
});
