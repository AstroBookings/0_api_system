import { hashText, isValid } from './hash.util';

describe('Hash Utility', () => {
  // Arrange
  const plainText = 'password123';
  const expectedHassedText =
    'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';

  describe('hashText', () => {
    it('should hash the given text', () => {
      // Act
      const actual = hashText(plainText);
      // Assert
      expect(actual).toBe(expectedHassedText);
    });

    it('should produce different hashes for different inputs', () => {
      // Act
      const hash1 = hashText('password1');
      const hash2 = hashText('password2');
      // Assert
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('isValid', () => {
    it('should return true for matching plain text and hash', () => {
      // Act
      const actual = isValid(plainText, expectedHassedText);
      // Assert
      expect(actual).toBe(true);
    });

    it('should return false for non-matching plain text and hash', () => {
      // Act
      const actual = isValid('wrongpassword', expectedHassedText);
      // Assert
      expect(actual).toBe(false);
    });
  });
});
