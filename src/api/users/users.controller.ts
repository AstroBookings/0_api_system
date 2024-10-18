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
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
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
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('ping')
  @ApiOperation({ summary: 'Ping endpoint to verify service availability' })
  @ApiOkResponse({ description: 'Pong text upon successful ping' })
  ping(): string {
    return 'pong';
  }

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: UserTokenDto, description: 'User token upon registration' })
  @ApiBadRequestResponse({ description: 'Bad request if the input is invalid' })
  @ApiConflictResponse({ description: 'Conflict if the email is already in use' })
  async register(@Body() registerDto: RegisterDto): Promise<UserTokenDto> {
    return await this.usersService.register(registerDto);
  }

  @Post('login')
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ type: UserTokenDto, description: 'User token upon successful login' })
  @ApiBadRequestResponse({ description: 'Bad request if the input is invalid' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized if the email or password is incorrect' })
  async login(@Body() loginDto: LoginDto): Promise<UserTokenDto> {
    return await this.usersService.login(loginDto);
  }

  @Delete('')
  @UseGuards(AuthApiKeyGuard)
  @UseGuards(AuthUserTokenGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete the current user' })
  @ApiSecurity('apiKey')
  @ApiOkResponse({ description: 'Empty response upon successful deletion' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized if the user is not authenticated' })
  @ApiNotFoundResponse({ description: 'Not found if the user does not exist' })
  async delete(@AuthUser() userId: string): Promise<void> {
    return await this.usersService.delete(userId);
  }

  @Get(':id')
  @UseGuards(AuthApiKeyGuard)
  @ApiOperation({ summary: 'Get user information by ID' })
  @ApiSecurity('apiKey')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the user' })
  @ApiOkResponse({ type: UserDto, description: 'User details' })
  @ApiNotFoundResponse({ description: 'Not found if the user does not exist' })
  async getUserById(@Param('id') userId: string): Promise<UserDto> {
    return await this.usersService.findById(userId);
  }
}
