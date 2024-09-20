import * as hashUtil from '@ab/utils/hash.util';
import * as idUtil from '@ab/utils/id.util';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
import { UserTokenDto } from '../models/user-token.dto';
import { UserEntity } from '../models/user.entity';
import { AuthenticationService } from './authentication.service';
import { UserRepository } from './user.repository';

// Arrange: Setup input data for tests
const inputRegisterUser: RegisterDto = {
  name: 'Test User',
  email: 'test.user@test.dev',
  password: 'Password@0',
  role: 'traveler',
};
const inputLoginUser: LoginDto = {
  email: inputRegisterUser.email,
  password: inputRegisterUser.password,
};

// Arrange: Setup mock data for tests
const mockId: string = 'user_1';
const mockHashedPassword: string = 'hashed_password';

// Arrange: Setup mock functions for tests
const mockUserRepository = () => ({
  findByEmail: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});
jest.mock('@ab/shared/utils/hash.util', () => ({
  hashText: jest.fn(),
  isValid: jest.fn(),
}));
jest.mock('@ab/utils/id.util', () => ({
  generateId: jest.fn(),
}));

describe('new AuthenticationService()', () => {
  // Arrange : declare variables
  let service: AuthenticationService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    // Arrange : setup module and dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('.register(registerDto)', () => {
    it('should register a new user and return a token', async () => {
      // Arrange : setup mock functions
      (idUtil.generateId as jest.Mock).mockReturnValue(mockId);
      (hashUtil.hashText as jest.Mock).mockReturnValue(mockHashedPassword);
      const mockUserEntity = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputRegisterUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      userRepository.findByEmail = jest.fn().mockResolvedValue(undefined);
      userRepository.save = jest.fn().mockResolvedValue(undefined);

      // Act : execute the function
      const actualUserToken: UserTokenDto = await service.register(inputRegisterUser);

      // Assert : check the result
      expect(userRepository.findByEmail).toHaveBeenCalledWith(inputRegisterUser.email);
      expect(userRepository.save).toHaveBeenCalledWith(mockUserEntity);
      expect(actualUserToken).toHaveProperty('token');
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      const mockExistingUser = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputRegisterUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      userRepository.findByEmail = jest.fn().mockResolvedValue(mockExistingUser);

      // Act & Assert
      await expect(service.register(inputRegisterUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('.login(loginDto)', () => {
    it('should login a user and return a token', async () => {
      // Arrange
      const mockExistingUser = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputLoginUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      userRepository.findByEmail = jest.fn().mockResolvedValue(mockExistingUser);
      (hashUtil.isValid as jest.Mock).mockReturnValue(true);

      // Act
      const result: UserTokenDto = await service.login(inputLoginUser);

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(inputLoginUser.email);
      expect(result).toHaveProperty('token');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      userRepository.findByEmail = jest.fn().mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.login(inputLoginUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      // Arrange
      const mockExistingUser = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputLoginUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      userRepository.findByEmail = jest.fn().mockResolvedValue(mockExistingUser);
      (hashUtil.isValid as jest.Mock).mockReturnValue(false);

      // Act & Assert
      await expect(service.login(inputLoginUser)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('.delete(loginDto)', () => {
    it('should delete a user', async () => {
      // Arrange
      const mockExistingUser = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputLoginUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      userRepository.findByEmail = jest.fn().mockResolvedValue(mockExistingUser);
      (hashUtil.isValid as jest.Mock).mockReturnValue(true);
      userRepository.delete = jest.fn().mockResolvedValue(undefined);

      // Act
      await service.delete(inputLoginUser);

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(inputLoginUser.email);
      expect(userRepository.delete).toHaveBeenCalledWith(mockExistingUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: inputLoginUser.email,
        password: inputLoginUser.password,
      };
      userRepository.findByEmail = jest.fn().mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.delete(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      // Arrange
      userRepository.findByEmail = jest.fn().mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.delete(inputLoginUser)).rejects.toThrow(UnauthorizedException);
    });
  });
});
