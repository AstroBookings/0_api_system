import { User } from './user.type';

/**
 * The user and token returned after a successful login or registration
 */
export class UserTokenDto {
  /**
   * The user object
   * @example { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', role: 'traveler' }
   */
  user: User;

  /**
   * The JWT token
   * @example 'abc123'
   */
  token: string;

  /**
   * The expiration date of the token in milliseconds
   * @example 1234567890
   */
  exp: number;
}
