import { AuthApiKeyGuard } from '@ab/auth/auth-api-key.guard';
import { AuthUserTokenGuard } from '@ab/auth/auth-user-token.guard';
import { AuthUser } from '@ab/auth/auth-user.decorator';
import { Body, Controller, Delete, Get, HttpCode, Logger, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';

import { UserTokenDto } from './models/user-token.dto';
import { UsersService } from './providers/users.service';

/**
 * Users controller for handling user registration, login and deletion
 */
@Controller('api/users')
export class UsersController {
  readonly #logger = new Logger(UsersController.name);

  constructor(private readonly authenticationService: UsersService) {}
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
    return this.authenticationService.register(registerDto);
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
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<UserTokenDto> {
    this.#logger.verbose(`Logging in user: ${loginDto.email}`);
    return this.authenticationService.login(loginDto);
  }

  /**
   * Delete a user. Requires an API key and the user to be authenticated
   *
   * 📦 void
   */
  @Delete('')
  @UseGuards(AuthApiKeyGuard)
  @UseGuards(AuthUserTokenGuard)
  async delete(@AuthUser() userId: string): Promise<void> {
    this.#logger.verbose(`Deleting user: ${userId}`);
    return this.authenticationService.delete(userId);
  }
}
