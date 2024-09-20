import { Injectable } from '@nestjs/common';
import { UserEntity } from '../models/user.entity';

/**
 * Abstract class for user repository
 */
export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<UserEntity | undefined>;
  abstract save(user: UserEntity): Promise<void>;
  abstract delete(user: UserEntity): Promise<void>;
}

/**
 * In-memory user repository implementation
 */
@Injectable()
export class InMemoryUserRepository extends UserRepository {
  private readonly users: UserEntity[] = [];

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async save(user: UserEntity): Promise<void> {
    this.users.push(user);
  }

  async delete(user: UserEntity): Promise<void> {
    const index = this.users.indexOf(user);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }
}
