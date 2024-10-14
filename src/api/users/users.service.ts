import { TokenService } from '@ab/token/token.service';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { UserDto } from './models/user.dto';
import { UserEntity } from './models/user.entity';
import { UsersRepository } from './users.repository';

/**
 * Service for managing user-related operations.
 * Handles user registration, login, and deletion.
 * Utilizes UsersRepository for data persistence and TokenService for token generation.
 * @requires UsersRepository - Repository for user data persistence.
 * @requires TokenService - Service for token generation.
 */
@Injectable()
export class UsersService {
  readonly #logger = new Logger(UsersService.name);

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly tokenService: TokenService,
  ) {
    this.#logger.verbose('Initialized');
  }

  /**
   * Registers a new user.
   * @param registerDto - Data transfer object containing user registration details.
   * @returns A promise that resolves to a UserTokenDto containing the user and their token.
   * @throws ConflictException if the user already exists.
   */
  async register(registerDto: RegisterDto): Promise<UserTokenDto> {
    const alreadyExistingUser = await this.userRepository.findByEmail(registerDto.email);
    if (alreadyExistingUser) {
      this.#logger.warn(`User already exists: ${registerDto.email}`);
      throw new ConflictException('User already exists');
    }
    const userEntity: UserEntity = UserEntity.fromDto(registerDto);
    await this.userRepository.save(userEntity);
    return await this.#mapToUserToken(userEntity);
  }

  /**
   * Logs in a user.
   * @param loginDto - Data transfer object containing user login details.
   * @returns A promise that resolves to a UserTokenDto containing the user and their token.
   * @throws UnauthorizedException if the user is not found or the password is invalid.
   */
  async login(loginDto: LoginDto): Promise<UserTokenDto> {
    const userEntity = await this.userRepository.findByEmail(loginDto.email);
    if (!userEntity) {
      this.#logger.verbose(`User not found: ${loginDto.email}`);
      throw new UnauthorizedException(`Unauthorized user: ${loginDto.email}`);
    }
    if (!userEntity.validate(loginDto.password)) {
      this.#logger.verbose(`Invalid password for user: ${loginDto.email}`);
      throw new UnauthorizedException(`Unauthorized user: ${loginDto.email}`);
    }
    return await this.#mapToUserToken(userEntity);
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
    return userEntity.toDto();
  }

  async #mapToUserToken(userEntity: UserEntity): Promise<UserTokenDto> {
    const user = userEntity.toDto();
    const token = await this.tokenService.generateToken(userEntity.id);
    return { user, token };
  }
}
