import { Role } from './role.enum';
import { UserDto } from './user.dto';

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

  toUser(): UserDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
