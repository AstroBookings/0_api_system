import { IsEmail, IsString, MinLength } from 'class-validator';
import { Role } from './role.enum';

/**
 * The input data required to register a new user
 */
export class RegisterDto {
  /**
   * The name of the user
   * @example 'John Doe'
   */
  @IsString()
  name: string;

  /**
   * The email of the user
   * @example 'john.doe@example.com'
   */
  @IsEmail()
  email: string;

  /**
   * The password of the user
   * @example 'password'
   */
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * The role of the user
   * @example 'traveler'
   */
  @IsString()
  role: Role;
}
