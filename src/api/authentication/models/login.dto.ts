import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * The input data required to login a user
 */
export class LoginDto {
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
}
