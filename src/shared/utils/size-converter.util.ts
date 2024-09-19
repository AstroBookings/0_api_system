const KB = 1024;
/**
 * Converts bytes to KB when more than 1024
 * @param bytes - The number of bytes to convert
 * @returns A string representation of the size in B or KB
 */
export function convertToKB(bytes: number): string {
  if (bytes <= KB) return `${bytes}Bs`;
  return `${(bytes / KB).toFixed(2)}KBs`;
}
