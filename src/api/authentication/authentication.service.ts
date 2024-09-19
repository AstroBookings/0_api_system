import { hashText, isValid } from '@ab/shared/utils/hash.util';
import { generateId } from '@ab/shared/utils/id.util';
import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { UserEntity } from './models/user.entity';

@Injectable()
export class AuthenticationService {
  static readonly users: UserEntity[] = [];
  private readonly logger = new Logger(AuthenticationService.name);

  async register(registerDto: RegisterDto): Promise<UserTokenDto> {
    const userExists = AuthenticationService.users.find(
      (u) => u.email === registerDto.email,
    );
    if (userExists) {
      this.logger.error(`User already exists: ${registerDto.email}`);
      throw new ConflictException('User already exists');
    }
    const newUserEntity = new UserEntity(
      generateId(),
      registerDto.name,
      registerDto.email,
      registerDto.role,
      hashText(registerDto.password),
    );
    AuthenticationService.users.push(newUserEntity);
    return this.createUserToken(newUserEntity);
  }

  async login(loginDto: LoginDto): Promise<UserTokenDto> {
    const user = AuthenticationService.users.find(
      (u) => u.email === loginDto.email,
    );
    if (!user) {
      this.logger.debug(`User not found: ${loginDto.email}`);
      throw new UnauthorizedException(`Unauthorized user: ${loginDto.email}`);
    }
    const isValidPassword = isValid(loginDto.password, user.password);
    if (!isValidPassword) {
      this.logger.error(`Invalid password for user: ${loginDto.email}`);
      throw new UnauthorizedException(`Unauthorized user: ${loginDto.email}`);
    }
    return this.createUserToken(user);
  }

  async delete(loginDto: LoginDto): Promise<void> {
    const user = AuthenticationService.users.find(
      (u) => u.email === loginDto.email,
    );
    if (!user) {
      this.logger.debug(`User not found: ${loginDto.email}`);
      throw new UnauthorizedException(`Unauthorized user: ${loginDto.email}`);
    }
    if (!isValid(loginDto.password, user.password)) {
      this.logger.error(`Invalid password for user: ${loginDto.email}`);
      throw new UnauthorizedException(`Unauthorized user: ${loginDto.email}`);
    }
    AuthenticationService.users.splice(
      AuthenticationService.users.indexOf(user),
      1,
    );
  }

  private createUserToken(user: UserEntity): UserTokenDto {
    return {
      user: user.toUser(),
      token: 'abc123',
      exp: 1234567890,
    };
  }
}
