import { Injectable } from '@nestjs/common';
import { UserEntity } from './models/user.entity';
import { UsersRepository } from './users.repository';

/**
 * In-memory repository implementation for users
 * This class provides an in-memory storage solution for user entities
 * @implements UsersRepository
 */
@Injectable()
export class UsersInMemoryRepository extends UsersRepository {
  private static readonly users: UserEntity[] = [];

  /**
   * Find a user by their email address
   * @param email - The email address to search for
   * @returns A promise that resolves to the found UserEntity or undefined if not found
   */
  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return UsersInMemoryRepository.users.find((user) => user.email === email);
  }

  /**
   * Find a user by their ID
   * @param id - The ID to search for
   * @returns A promise that resolves to the found UserEntity or undefined if not found
   */
  async findById(id: string): Promise<UserEntity | undefined> {
    return UsersInMemoryRepository.users.find((user) => user.id === id);
  }

  /**
   * Save a new user entity to the in-memory storage
   * @param user - The UserEntity to save
   * @returns A promise that resolves when the user is saved
   */
  async save(user: UserEntity): Promise<UserEntity> {
    UsersInMemoryRepository.users.push(user);
    return user;
  }

  /**
   * Delete a user entity from the in-memory storage
   * @param user - The UserEntity to delete
   * @returns A promise that resolves when the user is deleted
   */
  async delete(user: UserEntity): Promise<void> {
    const index = UsersInMemoryRepository.users.indexOf(user);
    if (index > -1) {
      UsersInMemoryRepository.users.splice(index, 1);
    }
  }
}
