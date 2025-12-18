import { Injectable, Inject, Logger } from '@nestjs/common';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Weather } from './interfaces/weather.interface';

/**
 * Service for weather data that may influence parking patterns.
 * Rain or extreme heat typically increases parking demand.
 */
@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @Inject('DYNAMODB_CLIENT') private readonly dynamoClient: DynamoDBClient,
    @Inject('TABLE_NAME') private readonly tableName: string,
  ) {}

  /** Retrieves current weather conditions for CSULB campus. */
  async getCurrent(): Promise<Weather | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND SK = :sk',
        ExpressionAttributeValues: {
          ':pk': { S: `WEATHER#${today}` },
          ':sk': { S: 'CURRENT' },
        },
      });

      const result = await this.dynamoClient.send(command);
      
      if (!result.Items || result.Items.length === 0) {
        this.logger.warn(`No weather data found for ${today}`);
        return null;
      }

      return unmarshall(result.Items[0]) as Weather;
    } catch (error) {
      this.logger.error('Failed to fetch current weather', error);
      throw error;
    }
  }
}
