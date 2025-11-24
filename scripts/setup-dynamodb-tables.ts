import {
  DynamoDBClient,
  CreateTableCommand,
  ListTablesCommand,
  DeleteTableCommand,
} from '@aws-sdk/client-dynamodb';

const REGION = process.env.AWS_REGION || 'us-west-2';
const ENDPOINT = process.env.DYNAMO_ENDPOINT || 'http://localhost:8000';

const client = new DynamoDBClient({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  },
});

async function setupTables() {
  console.log('🚀 Setting up DynamoDB tables...\n');
  console.log(`Region: ${REGION}`);
  console.log(`Endpoint: ${ENDPOINT}\n`);

  // Check existing tables
  const listCommand = new ListTablesCommand({});
  const existingTables = await client.send(listCommand);
  console.log('📋 Existing tables:', existingTables.TableNames || []);

  // Create parking lots table
  const tableName = 'sharkpark-parking-lots';
  
  // Delete if exists
  if (existingTables.TableNames?.includes(tableName)) {
    console.log(`\n🗑️  Deleting existing table: ${tableName}`);
    await client.send(new DeleteTableCommand({ TableName: tableName }));
    // Wait a bit for deletion
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n✨ Creating table: ${tableName}`);
  
  const createCommand = new CreateTableCommand({
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST', // On-demand billing
  });

  try {
    await client.send(createCommand);
    console.log(`✅ Table created successfully: ${tableName}`);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ResourceInUseException') {
      console.log(`⚠️  Table already exists: ${tableName}`);
    } else {
      throw error;
    }
  }

  // List tables again to confirm
  const finalTables = await client.send(listCommand);
  console.log('\n📊 Final tables:', finalTables.TableNames);
  console.log('\n✅ Setup complete!\n');
}

setupTables().catch((error) => {
  console.error('❌ Error setting up tables:', error);
  process.exit(1);
});
