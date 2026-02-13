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

// Export an async config — safest way for Vercel builds
export default defineConfig(async () => {
  // Example usage inside function
  const exampleTags = generateTags('Welcome to SDM Tech Solution! Build your own tagger.');
  console.log('Example tags (build-time):', exampleTags);

  return {
    plugins: [react()],
    // add other Vite options here
  };
});
