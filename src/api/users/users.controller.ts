import { AuthApiKeyGuard } from '@ab/auth/auth-api-key.guard';
import { AuthUserTokenGuard } from '@ab/auth/auth-user-token.guard';
import { AuthUser } from '@ab/auth/auth-user.decorator';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { UserDto } from './models/user.dto';
import { UsersService } from './users.service';

/**
 * Controller for user-related operations
 */
@Controller('api/users')
export class UsersController {
  constructor(private readonly authenticationService: UsersService) {}

  /**
   * Ping endpoint to verify service availability
   */
  @Get('ping')
  @ApiOkResponse({ description: 'Pong text upon successful ping' })
  ping(): string {
    return 'pong';
  }

  /**
   * Register a new user.
   */
  @Post('register')
  @HttpCode(201)
  @ApiCreatedResponse({ type: UserTokenDto, description: 'User token upon registration' })
  @ApiBadRequestResponse({ description: 'Bad request if the input is invalid' })
  @ApiConflictResponse({ description: 'Conflict if the email is already in use' })
  async register(@Body() registerDto: RegisterDto): Promise<UserTokenDto> {
    return this.authenticationService.register(registerDto);
  }

  /**
   * Login a user.
   */
  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: UserTokenDto, description: 'User token upon successful login' })
  @ApiBadRequestResponse({ description: 'Bad request if the input is invalid' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized if the email or password is incorrect' })
  async login(@Body() loginDto: LoginDto): Promise<UserTokenDto> {
    return this.authenticationService.login(loginDto);
  }

  /**
   * Delete the current user.
   */
  @Delete('')
  @UseGuards(AuthApiKeyGuard)
  @UseGuards(AuthUserTokenGuard)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Empty response upon successful deletion' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized if the user is not authenticated' })
  @ApiNotFoundResponse({ description: 'Not found if the user does not exist' })
  async delete(@AuthUser() userId: string): Promise<void> {
    return this.authenticationService.delete(userId);
  }

  /**
   * Get user information by ID.
   */
  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the user' })
  @ApiOkResponse({ type: UserDto, description: 'User details' })
  @ApiNotFoundResponse({ description: 'Not found if the user does not exist' })
  async getUserById(@Param('id') userId: string): Promise<UserDto> {
    return await this.authenticationService.findById(userId);
  }
}
