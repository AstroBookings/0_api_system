import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';

/**
 * Authentication controller for handling user registration and login
 */
@Controller('auth')
export class AuthenticationController {
  readonly #logger = new Logger(AuthenticationController.name);

  /**
   * Ping endpoint to check if the authentication service is running
   *
   * 📦 'pong' if the controller is running
   */
  @Get('ping')
  ping(): string {
    this.#logger.verbose('Ping');
    return 'pong';
  }

  /**
   * Register a new user
   *
   * 📦 UserTokenDto {
   *  user: RegisterDto;
   *  token: string;
   *  exp: number;
   * }
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserTokenDto> {
    this.#logger.verbose(`Registering user: ${registerDto.email}`);
    return {
      user: {
        id: 'user-1',
        name: registerDto.name,
        email: registerDto.email,
        role: registerDto.role,
      },
      token: 'abc123',
      exp: 1234567890,
    };
  }

  /**
   * Login a user
   *
   * 📦 UserTokenDto {
   *  user: LoginDto;
   *  token: string;
   *  exp: number;
   * }
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<UserTokenDto> {
    this.#logger.verbose(`Logging in user: ${loginDto.email}`);
    return {
      user: {
        id: 'user-1',
        name: 'John Doe',
        email: loginDto.email,
        role: 'traveler',
      },
      token: 'abc123',
      exp: 1234567890,
    };
  }
}
