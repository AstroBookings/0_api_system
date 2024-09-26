import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenPayload } from './token-payload.type';
import { TokenService } from './token.service';

describe('new TokenService()', () => {
  let tokenService: TokenService;
  let mockJwtService: jest.Mocked<JwtService>;

  const inputSub = 'testUserId';
  const inputToken = 'validToken';
  const mockSignedToken = 'mockSignedToken';
  const mockDecodedPayload: TokenPayload = { sub: inputSub, iat: 0, exp: 0 };

  beforeEach(async () => {
    // Arrange: Set up the testing environment
    mockJwtService = {
      signAsync: jest.fn().mockResolvedValue(mockSignedToken),
      verifyAsync: jest.fn().mockResolvedValue(mockDecodedPayload),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, { provide: JwtService, useValue: mockJwtService }],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  describe('.generateToken(sub)', () => {
    it('should generate a JWT token for the given subject', async () => {
      // Act: Call the method being tested
      const actualToken = await tokenService.generateToken(inputSub);

      // Assert: Verify the expected behavior
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: inputSub });
      expect(actualToken).toBe(mockSignedToken);
    });
  });

  describe('.validateToken(token)', () => {
    it('should validate and return the decoded token payload', async () => {
      // Act: Call the method being tested
      const actualPayload = await tokenService.validateToken(inputToken);

      // Assert: Verify the expected behavior
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(inputToken);
      expect(actualPayload).toEqual(mockDecodedPayload);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      // Arrange: Configure mock to simulate an error
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      // Act & Assert: Verify that the method throws an UnauthorizedException
      await expect(tokenService.validateToken(inputToken)).rejects.toThrow(UnauthorizedException);
    });
  });
});
