import { Injectable } from '@nestjs/common';
import { UserEntity } from '../models/user.entity';

/**
 * Abstract class for user repository
 */
export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<UserEntity | undefined>;
  abstract findById(id: string): Promise<UserEntity | undefined>;
  abstract save(user: UserEntity): Promise<void>;
  abstract delete(user: UserEntity): Promise<void>;
}

/**
 * In-memory user repository implementation
 */
@Injectable()
export class InMemoryUsersRepository extends UsersRepository {
  private static readonly users: UserEntity[] = [];

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return InMemoryUsersRepository.users.find((user) => user.email === email);
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    return InMemoryUsersRepository.users.find((user) => user.id === id);
  }

  async save(user: UserEntity): Promise<void> {
    InMemoryUsersRepository.users.push(user);
  }

  async delete(user: UserEntity): Promise<void> {
    const index = InMemoryUsersRepository.users.indexOf(user);
    if (index > -1) {
      InMemoryUsersRepository.users.splice(index, 1);
    }
  }
}
