import { Injectable, Inject, Logger } from '@nestjs/common';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { CampusEvent, EventImpact } from './interfaces/event.interface';

/**
 * Service for campus events that may affect parking availability.
 * Events include sports games, graduation, orientations, etc.
 */
@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @Inject('DYNAMODB_CLIENT') private readonly dynamoClient: DynamoDBClient,
    @Inject('TABLE_NAME') private readonly tableName: string,
  ) {}

  /** Retrieves all campus events, optionally filtered by event type. */
  async findAll(eventType?: string): Promise<CampusEvent[]> {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI1-EntityType-Timestamp',
        KeyConditionExpression: 'EntityType = :type',
        ExpressionAttributeValues: {
          ':type': { S: 'CampusEvent' },
        },
      });

      const result = await this.dynamoClient.send(command);
      let events = (result.Items || []).map((item) => unmarshall(item)) as CampusEvent[];
      
      if (eventType) {
        events = events.filter((e) => e.event_type === eventType);
      }
      
      return events;
    } catch (error) {
      this.logger.error('Failed to fetch campus events', error);
      throw error;
    }
  }

  /** Retrieves parking lot impacts for a specific event (closures, capacity changes). */
  async getImpacts(eventId: string): Promise<EventImpact[]> {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': { S: `EVENT#${eventId}` },
          ':sk': { S: 'IMPACT#' },
        },
      });

      const result = await this.dynamoClient.send(command);
      return (result.Items || []).map((item) => unmarshall(item)) as EventImpact[];
    } catch (error) {
      this.logger.error(`Failed to fetch impacts for event ${eventId}`, error);
      throw error;
    }
  }
}
