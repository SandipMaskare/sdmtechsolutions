import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Custom tagger code directly inside vite.config.ts
function generateTags(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean);

  const uniqueWords = Array.from(new Set(words));

  return uniqueWords.slice(0, 5);
}

// Example usage
console.log('Example tags:', generateTags('Welcome to SDM Tech Solution!'));

export default defineConfig({
  plugins: [react()],
});
