import { TokenService } from '@ab/shared/token/token.service';
import * as hashUtil from '@ab/utils/hash.util';
import * as idUtil from '@ab/utils/id.util';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { UserDto } from './models/user.dto';
import { UserEntity } from './models/user.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

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

// Arrange: Setup mock dependencies
const mockUserRepository = () => ({
  findByEmail: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});
const mockTokenService = () => ({
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
});
// Arrange: Setup mock functions
jest.mock('@ab/shared/utils/hash.util', () => ({
  hashText: jest.fn(),
  isValid: jest.fn(),
}));
jest.mock('@ab/utils/id.util', () => ({
  generateId: jest.fn(),
}));

describe('new AuthenticationService()', () => {
  // Arrange : declare variables for SUT and main dependencies
  let service: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    // Arrange : setup module and dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useFactory: mockUserRepository },
        { provide: TokenService, useFactory: mockTokenService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('.register(registerDto)', () => {
    it('should register a new user and return a token', async () => {
      // Arrange : setup mock functions with expected values
      (idUtil.generateId as jest.Mock).mockReturnValue(mockId);
      (hashUtil.hashText as jest.Mock).mockReturnValue(mockHashedPassword);
      usersRepository.findByEmail = jest.fn().mockResolvedValue(undefined);
      usersRepository.save = jest.fn().mockResolvedValue(undefined);
      // Arrange : setup expected user entity
      const expectedUserEntity = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputRegisterUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      // Act : execute the function
      const actualUserToken: UserTokenDto = await service.register(inputRegisterUser);
      // Assert : check the sut do the proper calls
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(inputRegisterUser.email);
      expect(usersRepository.save).toHaveBeenCalledWith(expectedUserEntity);
      // Assert : check the result
      expect(actualUserToken).toHaveProperty('token');
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange: setup mock functions with expected values
      const mockExistingUser = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputRegisterUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      usersRepository.findByEmail = jest.fn().mockResolvedValue(mockExistingUser);

      // Act & Assert that the function throws an error
      await expect(service.register(inputRegisterUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('.login(loginDto)', () => {
    it('should login a user and return a token', async () => {
      // Arrange: setup mock functions with expected values
      const mockExistingUser = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputLoginUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      usersRepository.findByEmail = jest.fn().mockResolvedValue(mockExistingUser);
      (hashUtil.isValid as jest.Mock).mockReturnValue(true);

      // Act
      const result: UserTokenDto = await service.login(inputLoginUser);

      // Assert: check the sut do the proper calls
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(inputLoginUser.email);
      // Assert: check the result
      expect(result).toHaveProperty('token');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange: setup mock functions for not found user
      usersRepository.findByEmail = jest.fn().mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.login(inputLoginUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      // Arrange : setup mock functions with expected values
      const mockExistingUser = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputLoginUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      usersRepository.findByEmail = jest.fn().mockResolvedValue(mockExistingUser);
      (hashUtil.isValid as jest.Mock).mockReturnValue(false);

      // Act & Assert that the function throws an error
      await expect(service.login(inputLoginUser)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('.delete(userId)', () => {
    it('should delete a user by id', async () => {
      // Arrange : setup mock functions with expected values
      const inputUserId = mockId;
      const mockExistingUser = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputLoginUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      usersRepository.findById = jest.fn().mockResolvedValue(mockExistingUser);
      usersRepository.delete = jest.fn().mockResolvedValue(undefined);

      // Act : execute the function
      await service.delete(inputUserId);

      // Assert
      expect(usersRepository.findById).toHaveBeenCalledWith(inputUserId);
      expect(usersRepository.delete).toHaveBeenCalledWith(mockExistingUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange : setup mock functions for not found user
      const inputUserId = mockId;
      usersRepository.findById = jest.fn().mockResolvedValue(undefined);

      // Act & Assert that the function throws an error
      await expect(service.delete(inputUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('.findById(userId)', () => {
    it('should find a user by id', async () => {
      // Arrange : setup mock functions with expected values
      const inputUserId = mockId;
      const mockExistingUser = new UserEntity(
        mockId,
        inputRegisterUser.name,
        inputLoginUser.email,
        inputRegisterUser.role,
        mockHashedPassword,
      );
      usersRepository.findById = jest.fn().mockResolvedValue(mockExistingUser);

      // Act : execute the function
      const result: UserDto = await service.findById(inputUserId);

      // Assert: check the sut do the proper calls
      expect(usersRepository.findById).toHaveBeenCalledWith(inputUserId);
      // Assert: check the result
      expect(result).toEqual(mockExistingUser.toDto());
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange : setup mock functions for not found user
      const inputUserId = mockId;
      usersRepository.findById = jest.fn().mockResolvedValue(undefined);

      // Act & Assert that the function throws an error
      await expect(service.findById(inputUserId)).rejects.toThrow(NotFoundException);
    });
  });
});
