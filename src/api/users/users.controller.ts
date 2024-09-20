import { Body, Controller, Delete, Get, HttpCode, Logger, Post } from '@nestjs/common';
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
   * Delete a user
   *
   * 📦 void
   */
  @Delete('')
  async delete(@Body() loginDto: LoginDto): Promise<void> {
    this.#logger.verbose(`Deleting user: ${loginDto.email}`);
    return this.authenticationService.delete(loginDto);
  }
}
