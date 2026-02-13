// src/utils/myTagger.ts

/**
 * Simple custom tag generator
 * Input: a string of text
 * Output: array of up to 5 unique lowercase tags
 */
export function generateTags(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '') // remove special characters
    .split(' ')
    .filter(Boolean);

  const uniqueWords = Array.from(new Set(words));

  return uniqueWords.slice(0, 5);
}
