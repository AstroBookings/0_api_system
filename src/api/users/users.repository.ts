import { UserEntity } from './models/user.entity';

/**
 * Abstract class defining the contract for user repository implementations
 * This class outlines the essential operations for managing user entities
 */
export abstract class UsersRepository {
  /**
   * Find a user by their email address
   * @param email - The email address to search for
   * @returns A promise that resolves to the found UserEntity or undefined if not found
   */
  abstract findByEmail(email: string): Promise<UserEntity | undefined>;

  /**
   * Find a user by their ID
   * @param id - The ID to search for
   * @returns A promise that resolves to the found UserEntity or undefined if not found
   */
  abstract findById(id: string): Promise<UserEntity | undefined>;

  /**
   * Save a new user entity or update an existing one
   * @param user - The UserEntity to save or update
   * @returns A promise that resolves when the operation is complete
   */
  abstract save(user: UserEntity): Promise<void>;

  /**
   * Delete a user entity
   * @param user - The UserEntity to delete
   * @returns A promise that resolves when the operation is complete
   */
  abstract delete(user: UserEntity): Promise<void>;
}
