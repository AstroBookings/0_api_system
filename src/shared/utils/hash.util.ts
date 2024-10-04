import * as crypto from 'crypto';

/**
 * Hash a password.
 * @param {string} text - The text to hash.
 * @returns {string} - The hashed text.
 */
export function hashText(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Compares a plain text with a hashed value.
 * @param plain - The plain text to hash and compare.
 * @param expectedHash - The expected hashed value to compare against.
 * @returns true if the expected hash matches the actual hash, false otherwise.
 */
export function isValid(plain: string, expectedHash: string): boolean {
  const actualHash = hashText(plain);
  return actualHash === expectedHash;
}
