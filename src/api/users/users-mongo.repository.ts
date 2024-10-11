import { MongoDocument, MongoRepository } from '@ab/shared/data/mongo.repository';
import { Injectable } from '@nestjs/common';
import { UserData, UserEntity } from './models/user.entity';
import { UsersRepository } from './users.repository';

/**
 * MongoDB repository implementation for users
 * @implements UsersRepository
 */
@Injectable()
export class UsersMongoRepository extends UsersRepository {
  private collection = this.mongoService.db.collection<MongoDocument<UserData>>('users');

  constructor(private readonly mongoService: MongoRepository) {
    super();
  }

  /**
   * Finds a user by their email address
   * @param email - The email address to search for
   * @returns A promise that resolves to a UserEntity or undefined if not found
   */
  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const userDocument = await this.collection.findOne({ email });
    return this.#mapFromMongo(userDocument);
  }

  /**
   * Finds a user by their ID
   * @param id - The ID to search for
   * @returns A promise that resolves to a UserEntity or undefined if not found
   */
  async findById(id: string): Promise<UserEntity | undefined> {
    const _id = this.mongoService.mapToObjectId(id);
    const userDocument = await this.collection.findOne({ _id });
    return this.#mapFromMongo(userDocument);
  }

  /**
   * Saves a user entity to the MongoDB collection
   * @param user - The UserEntity to save
   * @returns A promise that resolves to the saved UserEntity
   */
  async save(user: UserEntity): Promise<UserEntity | undefined> {
    const userDocument = this.mongoService.mapToDocument(user);
    await this.collection.insertOne(userDocument);
    return user;
  }

  /**
   * Deletes a user entity from the MongoDB collection
   * @param user - The UserEntity to delete
   * @returns A promise that resolves when the user is deleted
   */
  async delete(user: UserEntity): Promise<void> {
    const _id = this.mongoService.mapToObjectId(user.id);
    await this.collection.deleteOne({ _id });
  }

  #mapFromMongo(userDocument: MongoDocument<UserData> | null): UserEntity | undefined {
    if (!userDocument) return undefined;
    const usersData = this.mongoService.mapFromDocument(userDocument);
    return UserEntity.fromData(usersData);
  }
}
