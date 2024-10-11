// Test the MongoRepository

// Test the mapToObjectId method works with mapFromObjectId

import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { MongoRepository } from './mongo.repository';

describe('MongoRepository', () => {
  let mongoRepository: MongoRepository;

  beforeAll(() => {
    const configServiceMock: unknown = {
      get(): string {
        return 'mongodb://localhost:27017';
      },
    };
    mongoRepository = new MongoRepository(configServiceMock as ConfigService);
  });

  describe('.mapToObjectId(id: string)', () => {
    it('should return an ObjectId', () => {
      const id = '1844717569051725824';
      const objectId = mongoRepository.mapToObjectId(id);
      const actualId = objectId.toString();
      const expectedId = '000001844717569051725824';
      expect(actualId).toHaveLength(24);
      expect(actualId).toBe(expectedId);
    });
  });

  describe('.mapFromObjectId(objectId: ObjectId)', () => {
    it('should return a string', () => {
      const objectId = new ObjectId('000001844717569051725824');
      const actualId = mongoRepository.mapFromObjectId(objectId);
      const expectedId = '1844717569051725824';
      expect(actualId).toBe(expectedId);
    });
  });
});
