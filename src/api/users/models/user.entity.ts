import { Role } from './role.enum';
import { User } from './user.type';

/**
 * The User entity representing a user in the system
 */
export class UserEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly role: Role,
    readonly password: string,
  ) {}

  toUser(): User {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
