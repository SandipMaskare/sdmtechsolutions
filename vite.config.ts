import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Import your custom tagger (use .js extension for ESM)
import { generateTags } from './src/utils/myTagger.js';

// Example usage during build (optional)
console.log('Example tags:', generateTags('Welcome to SDM Tech Solution! Custom build tags'));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // optional shortcut for imports
    },
  },
});
