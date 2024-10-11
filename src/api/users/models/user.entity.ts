import { hashText, isValid } from '@ab/utils/hash.util';
import { generateId } from '@ab/utils/id.util';
import { RegisterDto } from './register.dto';
import { Role } from './role.enum';
import { UserDto } from './user.dto';

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
};

/**
 * The User entity representing a user in the system
 */
export class UserEntity implements UserData {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly role: Role,
    readonly password: string,
  ) {}

  static fromDto(dto: RegisterDto): UserEntity {
    return new UserEntity(generateId(), dto.name, dto.email, dto.role, hashText(dto.password));
  }

  static fromData(data: UserData): UserEntity {
    return new UserEntity(data.id, data.name, data.email, data.role, data.password);
  }

  validate(password: string): boolean {
    return isValid(password, this.password);
  }

  toDto(): UserDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
