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
