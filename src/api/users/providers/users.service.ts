import { TokenService } from '@ab/token/token.service';
import { hashText, isValid } from '@ab/utils/hash.util';
import { generateId } from '@ab/utils/id.util';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
import { UserTokenDto } from '../models/user-token.dto';
import { UserDto } from '../models/user.dto';
import { UserEntity } from '../models/user.entity';
import { UsersRepository } from '../users.repository';

/**
 * Service for managing user-related operations.
 * Handles user registration, login, and deletion.
 * Utilizes UsersRepository for data persistence and TokenService for token generation.
 * @requires UsersRepository - Repository for user data persistence.
 * @requires TokenService - Service for token generation.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Registers a new user.
   * @param registerDto - Data transfer object containing user registration details.
   * @returns A promise that resolves to a UserTokenDto containing the user and their token.
   * @throws ConflictException if the user already exists.
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
    return await this.createUserToken(newUserEntity);
  }

  /**
   * Logs in a user.
   * @param loginDto - Data transfer object containing user login details.
   * @returns A promise that resolves to a UserTokenDto containing the user and their token.
   * @throws UnauthorizedException if the user is not found or the password is invalid.
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
    return await this.createUserToken(user);
  }

  /**
   * Deletes a user by their ID.
   * @param userId - The ID of the user to delete.
   * @returns A promise that resolves when the user is deleted.
   * @throws NotFoundException if the user is not found.
   */
  async delete(userId: string): Promise<void> {
    const userEntity = await this.userRepository.findById(userId);
    if (!userEntity) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    await this.userRepository.delete(userEntity);
  }

  /**
   * Finds a user by their ID.
   * @param userId - The ID of the user to find.
   * @returns A promise that resolves to a User object.
   * @throws NotFoundException if the user is not found.
   */
  async findById(userId: string): Promise<UserDto> {
    const userEntity = await this.userRepository.findById(userId);
    if (!userEntity) {
      throw new NotFoundException(`User not found: ${userId}`);
    }
    return userEntity.toUser();
  }

  /**
   * Creates a user token.
   * @param userEntity - The user entity for which to create a token.
   * @returns A promise that resolves to a UserTokenDto containing the user and their token.
   */
  private async createUserToken(userEntity: UserEntity): Promise<UserTokenDto> {
    const token = await this.tokenService.generateToken(userEntity.id);
    const user = userEntity.toUser();
    return { user, token };
  }
}
