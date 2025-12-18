import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { DynamoDBClient, QueryCommand, PutItemCommand, DeleteItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';
import {
  User,
  UserFavorite,
  UserResponse,
} from './interfaces/user.interface';

/**
 * Service for user profile and favorites management.
 * Users are identified by their CSULB email address.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject('DYNAMODB_CLIENT') private readonly dynamoClient: DynamoDBClient,
    @Inject('TABLE_NAME') private readonly tableName: string,
  ) {}

  /** Retrieves user profile with their favorited parking lots. */
  async findOne(userId: string): Promise<UserResponse> {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND SK = :sk',
        ExpressionAttributeValues: {
          ':pk': { S: `USER#${userId}` },
          ':sk': { S: 'PROFILE' },
        },
      });

      const result = await this.dynamoClient.send(command);

      if (!result.Items || result.Items.length === 0) {
        throw new NotFoundException(`User ${userId} not found`);
      }

      const user = unmarshall(result.Items[0]) as User;
      const favorites = await this.getFavorites(userId);

      return {
        ...user,
        favorites: favorites.map((f) => f.lot_id),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch user ${userId}`, error);
      throw error;
    }
  }

  async getFavorites(userId: string): Promise<UserFavorite[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `USER#${userId}` },
        ':sk': { S: 'FAV#' },
      },
    });

    const result = await this.dynamoClient.send(command);
    return (result.Items || []).map((item) => unmarshall(item)) as UserFavorite[];
  }

  /** Adds a parking lot to user's favorites. */
  async addFavorite(userId: string, lotId: string): Promise<void> {
    // Verify user exists first
    await this.findOne(userId);

    const now = new Date().toISOString();
    const item = marshall({
      PK: `USER#${userId}`,
      SK: `FAV#${lotId}`,
      user_id: userId,
      lot_id: lotId,
      added_at: now,
      EntityType: 'UserFavorite',
      timestamp: now,
    });

    try {
      await this.dynamoClient.send(
        new PutItemCommand({
          TableName: this.tableName,
          Item: item,
        }),
      );
      this.logger.log(`Added favorite ${lotId} for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to add favorite ${lotId} for user ${userId}`, error);
      throw error;
    }
  }

  /** Removes a parking lot from user's favorites. */
  async removeFavorite(userId: string, lotId: string): Promise<void> {
    // Verify user exists first
    await this.findOne(userId);

    try {
      await this.dynamoClient.send(
        new DeleteItemCommand({
          TableName: this.tableName,
          Key: marshall({
            PK: `USER#${userId}`,
            SK: `FAV#${lotId}`,
          }),
        }),
      );
      this.logger.log(`Removed favorite ${lotId} for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to remove favorite ${lotId} for user ${userId}`, error);
      throw error;
    }
  }

  /** Updates user's notification preferences. */
  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<User['notification_preferences']>,
  ): Promise<UserResponse> {
    // Verify user exists first
    await this.findOne(userId);

    try {
      await this.dynamoClient.send(
        new UpdateItemCommand({
          TableName: this.tableName,
          Key: marshall({
            PK: `USER#${userId}`,
            SK: 'PROFILE',
          }),
          UpdateExpression: 'SET notification_preferences = :prefs, #ts = :ts',
          ExpressionAttributeNames: {
            '#ts': 'timestamp',
          },
          ExpressionAttributeValues: marshall({
            ':prefs': preferences,
            ':ts': new Date().toISOString(),
          }),
        }),
      );
      this.logger.log(`Updated notification preferences for user ${userId}`);
      return this.findOne(userId);
    } catch (error) {
      this.logger.error(`Failed to update notification preferences for user ${userId}`, error);
      throw error;
    }
  }
}
