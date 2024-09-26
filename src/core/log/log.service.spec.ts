import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';

describe('new LogService() with default log level', () => {
  let logService: LogService;
  let mockConfigService: jest.Mocked<ConfigService>;

  const inputLogLevel = 'log';
  const mockGetConfig = jest.fn().mockReturnValue(inputLogLevel);

  beforeEach(async () => {
    // Arrange: Set up the testing environment
    mockConfigService = {
      get: mockGetConfig,
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    logService = await module.resolve<LogService>(LogService);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('.error(message, context)', () => {
    it('should log error messages', () => {
      // Arrange: Prepare test data
      const inputMessage = 'Test error message';
      const inputContext = 'TestContext';

      // Act: Call the method being tested
      logService.error(inputMessage, inputContext);

      // Assert: Verify the expected behavior
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('TestContext'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test error message'));
    });
  });

  describe('.warn(message, context)', () => {
    it('should log warn messages', () => {
      // Arrange: Prepare test data
      const inputMessage = 'Test warn message';
      const inputContext = 'TestContext';

      // Act: Call the method being tested
      logService.warn(inputMessage, inputContext);

      // Assert: Verify the expected behavior
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('TestContext'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test warn message'));
    });
  });

  describe('.log(message, context)', () => {
    it('should log info messages', () => {
      // Arrange: Prepare test data
      const inputMessage = 'Test log message';
      const inputContext = 'TestContext';

      // Act: Call the method being tested
      logService.log(inputMessage, inputContext);

      // Assert: Verify the expected behavior
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('TestContext'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test log message'));
    });
  });

  describe('.debug(message, context)', () => {
    it('should not log debug messages', () => {
      // Arrange: Prepare test data
      const inputMessage = 'Test debug message';
      const inputContext = 'TestContext';

      // Act: Call the method being tested
      logService.debug(inputMessage, inputContext);

      // Assert: Verify the expected behavior
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Test debug message'));
    });
  });

  describe('.verbose(message, context)', () => {
    it('should not log verbose messages ', () => {
      // Arrange: Prepare test data
      const inputMessage = 'Test verbose message';
      const inputContext = 'TestContext';

      // Act: Call the method being tested
      logService.verbose(inputMessage, inputContext);

      // Assert: Verify the expected behavior
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Test verbose message'));
    });
  });
});
