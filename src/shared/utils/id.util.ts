import { Epoch, Snowyflake } from 'snowyflake';
/**
 * Snowyflake is a unique identifier generator that uses Twitter's Snowflake algorithm.
 * It is used to generate unique identifiers for events in a distributed system.
 * The identifier is a 64-bit integer that is unique across the system.
 */
const snowy = new Snowyflake({
  workerId: 0n,
  processId: 1n,
  epoch: Epoch.Twitter,
} as const);

/**
 * Generate a unique identifier.
 * @returns {string} The generated identifier.
 */
export function generateId(): string {
  return snowy.nextId().toString();
}
