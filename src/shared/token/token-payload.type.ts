/**
 * Token payload for JWT
 * @description JWT is composed of a header, payload, and signature.
 * @property {string} sub - Subject of the token (typically the user ID)
 * @property {number} iat - Issued at time
 * @property {number} exp - Expiration time
 */
export type TokenPayload = {
  sub: string;
  iat: number;
  exp: number;
};
