import { hashText, isValid } from '@ab/shared/utils/hash.util';
import { generateId } from '@ab/shared/utils/id.util';
import { TokenService } from '@ab/token/token.service';
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
import { UserEntity } from '../models/user.entity';
import { UsersRepository } from './users.repository';

/**
 * Service for the authentication logic
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly tokenService: TokenService,
  ) {}

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
    return await this.createUserToken(newUserEntity);
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
    return await this.createUserToken(user);
  }

  /**
   * Delete a user
   * @param loginDto - The user to delete
   */
  async delete(userId: string): Promise<void> {
    const userEntity = await this.userRepository.findById(userId);
    if (!userEntity) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    await this.userRepository.delete(userEntity);
  }

  private async createUserToken(userEntity: UserEntity): Promise<UserTokenDto> {
    const token = await this.tokenService.generateToken(userEntity.id);
    const user = userEntity.toUser();
    return { user, token };
  }
}
