const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env' : '.env.local';

/**
 * Main configuration to be used in AppModule
 */
export const CONFIG_OPTIONS = {
  envFilePath,
  isGlobal: true,
  cache: true,
};
/**
 * Nest app options to be used in `main.ts`
 */
export const NEST_APP_OPTIONS = {
  cors: true,
};
