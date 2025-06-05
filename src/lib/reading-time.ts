const WORDS_PER_MINUTE = 225; // Average adult reading speed
const CODE_WORDS_PER_MINUTE = 100; // Slower for code blocks
const IMAGE_TIME_SECONDS = 10; // Time to process an image
const MINIMUM_READ_TIME = 1; // Minimum reading time in minutes

/**
 * Extracts code blocks from MDX content
 * @param content - MDX content
 * @returns Array of code blocks
 */
function extractCodeBlocks(content: string): string[] {
  const codeBlockRegex = /```[\s\S]*?```/g;
  return content.match(codeBlockRegex) || [];
}

/**
 * Counts images in MDX content
 * @param content - MDX content
 * @returns Number of images
 */
function countImages(content: string): number {
  // Match both markdown and HTML image syntax
  const markdownImageRegex = /!\[.*?\]\(.*?\)/g;
  const htmlImageRegex = /<img.*?>/g;

  const markdownImages = content.match(markdownImageRegex) || [];
  const htmlImages = content.match(htmlImageRegex) || [];

  return markdownImages.length + htmlImages.length;
}

/**
 * Removes code blocks, images, and other non-text content from MDX
 * @param content - MDX content
 * @returns Clean text content
 */
function cleanContent(content: string): string {
  // Remove code blocks
  let cleanText = content.replace(/```[\s\S]*?```/g, "");

  // Remove images
  cleanText = cleanText.replace(/!\[.*?\]\(.*?\)/g, "");
  cleanText = cleanText.replace(/<img.*?>/g, "");

  // Remove HTML tags
  cleanText = cleanText.replace(/<[^>]*>/g, "");

  // Remove markdown links but keep text
  cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  return cleanText;
}

/**
 * Counts words in a text
 * @param text - Text to count words in
 * @returns Number of words
 */
function countWords(text: string): number {
  // Split by whitespace and filter out empty strings
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Calculates reading time for MDX content
 * @param content - MDX content
 * @returns Reading time in minutes and seconds
 */
export function calculateReadingTime(content: string): {
  minutes: number;
  text: string;
} {
  // Extract and count code blocks
  const codeBlocks = extractCodeBlocks(content);
  const codeBlockWords = codeBlocks.reduce(
    (total, block) => total + countWords(block),
    0
  );

  // Count images
  const imageCount = countImages(content);

  // Get clean text and count regular words
  const cleanText = cleanContent(content);
  const textWords = countWords(cleanText);

  // Calculate total reading time in minutes
  const textTime = textWords / WORDS_PER_MINUTE;
  const codeTime = codeBlockWords / CODE_WORDS_PER_MINUTE;
  const imageTime = (imageCount * IMAGE_TIME_SECONDS) / 60;

  let totalMinutes = textTime + codeTime + imageTime;

  // Ensure minimum reading time
  totalMinutes = Math.max(totalMinutes, MINIMUM_READ_TIME);

  // Round to nearest minute for display
  const minutes = Math.ceil(totalMinutes);

  // Create readable text
  const text = `${minutes} min read`;

  return { minutes, text };
}
