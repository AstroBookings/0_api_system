import { hashText, isValid } from '@ab/utils/hash.util';
import { generateId } from '@ab/utils/id.util';
import { RegisterDto } from './register.dto';
import { Role } from './role.enum';
import { UserDto } from './user.dto';

/**
 * The data type representing a user in the system
 */
export type UserData = {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
};

/**
 * The User entity with data and methods to handle logic
 */
export class UserEntity implements UserData {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly role: Role,
    readonly password: string,
  ) {}

  /**
   * Creates a new UserEntity from a RegisterDto
   * @param dto - The RegisterDto containing user data
   * @returns A new UserEntity with the data from the dto
   */
  static fromDto(dto: RegisterDto): UserEntity {
    return new UserEntity(generateId(), dto.name, dto.email, dto.role, hashText(dto.password));
  }

  /**
   * Creates a new UserEntity from a UserData object
   * @param data - The UserData object containing user data
   * @returns A new UserEntity with the data from the UserData object
   */
  static fromData(data: UserData): UserEntity {
    return new UserEntity(data.id, data.name, data.email, data.role, data.password);
  }

  /**
   * Validates the password of the user
   * @param password - The password to validate
   * @returns True if the password is valid, false otherwise
   */
  validate(password: string): boolean {
    return isValid(password, this.password);
  }

  /**
   * Converts the UserEntity to a UserDto
   * @returns A UserDto with the data from the UserEntity
   */
  toDto(): UserDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
