import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient, ObjectId } from 'mongodb';

type HasId = { id: string };
type OmitId<T> = Omit<T, 'id'>;
type Mongo_id = { _id: ObjectId };
/**
 * A type representing a MongoDocument with an ObjectId and the id field removed
 */
export type MongoDocument<T extends HasId> = OmitId<T> & Mongo_id;

/**
 * A service for interacting with MongoDB
 */
@Injectable()
export class MongoRepository {
  readonly #logger = new Logger(MongoRepository.name);
  readonly #client: MongoClient;

  public get db(): Db {
    return this.#client.db();
  }

  constructor(private readonly configService: ConfigService) {
    const mongoUri = this.configService.get<string>('MONGO_URI');
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined');
    }
    this.#client = new MongoClient(mongoUri);
    this.#logger.verbose(`Initialized at ${mongoUri}`);
  }

  /**
   * Converts or creates an ObjectId from a numeric string
   * @param id - The numeric string to convert
   * @returns An ObjectId based on the string or a new ObjectId if the string is not a number
   */
  mapToObjectId(id: string): ObjectId {
    if (isNaN(parseInt(id))) {
      return new ObjectId();
    }
    return new ObjectId(id.slice(0, 24).padStart(24, '0'));
  }

  /**
   * Converts an ObjectId to a numeric string
   * @param id - The ObjectId to convert
   * @returns A numeric string without initial zeros
   */
  mapFromObjectId(id: ObjectId): string {
    return id.toString().replace(/^0+/, '');
  }

  /**
   * Converts a data object to a MongoDocument (with an ObjectId, and the id field removed)
   * @param data - The data object to convert (must contain an id field)
   * @returns A MongoDocument with an ObjectId
   */
  mapToDocument<T extends { id: string }>(data: T): MongoDocument<T> {
    const _id = this.mapToObjectId(data.id);
    const { id, ...rest } = data;
    return { ...rest, _id };
  }

  /**
   * Converts a MongoDocument to a data object (with an id field)
   * @param document - The MongoDocument to convert
   * @returns A data object with an id field
   */
  mapFromDocument<T extends { id: string }>(document: MongoDocument<T>): T {
    const id = this.mapFromObjectId(document._id);
    const { _id, ...rest } = document;
    return { id, ...rest } as unknown as T;
  }
}
