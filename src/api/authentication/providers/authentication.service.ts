import { hashText, isValid } from '@ab/shared/utils/hash.util';
import { generateId } from '@ab/shared/utils/id.util';
import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
import { UserTokenDto } from '../models/user-token.dto';
import { UserEntity } from '../models/user.entity';
import { UserRepository } from './user.repository';

/**
 * Service for the authentication logic
 */
@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Register a new user
   * @param registerDto - The user to register
   * @returns The user token
   */
  async register(registerDto: RegisterDto): Promise<UserTokenDto> {
    const userExists = await this.userRepository.findByEmail(registerDto.email);
    if (userExists) {
      this.logger.warn(`User already exists: ${registerDto.email}`);
      throw new ConflictException('User already exists');
    }
    const newUserEntity = new UserEntity(
      generateId(),
      registerDto.name,
      registerDto.email,
      registerDto.role,
      hashText(registerDto.password),
    );
    await this.userRepository.save(newUserEntity);
    return this.createUserToken(newUserEntity);
  }

  /**
   * Login a user
   * @param loginDto - The user to login
   * @returns The user token
   */
  async login(loginDto: LoginDto): Promise<UserTokenDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      this.logger.debug(`User not found: ${loginDto.email}`);
      throw new UnauthorizedException(`Unauthorized user: ${loginDto.email}`);
    }
    const isValidPassword = isValid(loginDto.password, user.password);
    if (!isValidPassword) {
      this.logger.debug(`Invalid password for user: ${loginDto.email}`);
      throw new UnauthorizedException(`Unauthorized user: ${loginDto.email}`);
    }
    return this.createUserToken(user);
  }

  /**
   * Delete a user
   * @param loginDto - The user to delete
   */
  async delete(loginDto: LoginDto): Promise<void> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      this.logger.debug(`User not found: ${loginDto.email}`);
      throw new UnauthorizedException(`Unauthorized user: ${loginDto.email}`);
    }
    const isValidPassword = isValid(loginDto.password, user.password);
    if (!isValidPassword) {
      this.logger.debug(`Invalid password for user: ${loginDto.email}`);
      throw new UnauthorizedException(`Unauthorized user: ${loginDto.email}`);
    }
    await this.userRepository.delete(user);
  }

  private createUserToken(user: UserEntity): UserTokenDto {
    return {
      user: user.toUser(),
      token: 'abc123',
      exp: 1234567890,
    };
  }
}
