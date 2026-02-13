import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

/**
 * Custom tagger function
 * Input: string of text
 * Output: array of up to 5 unique lowercase tags
 */
function generateTags(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '') // remove special characters
    .split(' ')
    .filter(Boolean);

  const uniqueWords = Array.from(new Set(words));

  return uniqueWords.slice(0, 5);
}

// Example usage (will print during build)
console.log('Example tags:', generateTags('Welcome to SDM Tech Solution! Build your own tagger.'));

export default defineConfig({
  plugins: [react()],
  // You can add other Vite options here if needed
});
