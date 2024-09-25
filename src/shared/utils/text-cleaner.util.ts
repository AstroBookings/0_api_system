/**
 * Cleans the input text by removing special characters and truncating to a maximum length.
 * @param text The input text to clean
 * @param maxLength The maximum length of the cleaned text (default: 18)
 * @returns The cleaned and truncated text
 */
export function cleanText(text: string, maxLength: number = 18): string {
  // Remove special characters and trim whitespace
  const cleaned = text.replace(/[^a-zA-Z0-9]/g, '').trim();

  // Truncate to the specified maxLength and add ellipsis if necessary
  if (cleaned.length > maxLength) {
    return cleaned.slice(0, maxLength) + '...';
  }
  return cleaned;
}
