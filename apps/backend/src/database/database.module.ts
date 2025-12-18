import { Module, Global } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ConfigModule } from '@nestjs/config';

export const DYNAMODB_CLIENT = 'DYNAMODB_CLIENT';
export const TABLE_NAME = 'TABLE_NAME';
export const TIMESERIES_TABLE_NAME = 'TIMESERIES_TABLE_NAME';

/**
 * Global module providing DynamoDB client and table name constants.
 * Uses environment variables for configuration, falling back to local development defaults.
 */
@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: DYNAMODB_CLIENT,
      useFactory: () => {
        return new DynamoDBClient({
          region: process.env.AWS_REGION || 'us-west-2',
          endpoint: process.env.DYNAMO_ENDPOINT || 'http://localhost:8000',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
          },
        });
      },
    },
    {
      provide: TABLE_NAME,
      useValue: process.env.DYNAMODB_TABLE || 'sharkpark-main',
    },
    {
      provide: TIMESERIES_TABLE_NAME,
      useValue: process.env.DYNAMODB_TIMESERIES_TABLE || 'sharkpark-timeseries',
    },
  ],
  exports: [DYNAMODB_CLIENT, TABLE_NAME, TIMESERIES_TABLE_NAME],
})
export class DatabaseModule {}
