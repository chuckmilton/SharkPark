import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const REGION = process.env.AWS_REGION || 'us-west-2';
const ENDPOINT = process.env.DYNAMO_ENDPOINT || 'http://localhost:8000';
const TABLE_NAME = 'sharkpark-parking-lots';

const client = new DynamoDBClient({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  },
});

interface ParkingLot {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  confidence: 'LOW' | 'MED' | 'HIGH';
  lastUpdated: string;
}

async function demoCRUDOperations() {
  console.log('DynamoDB CRUD Demo - Submission 1, Step 4\n');
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Table: ${TABLE_NAME}\n`);
  console.log('='.repeat(60));

  // CREATE - Save data to DynamoDB
  console.log('\n[STEP 1] CREATE - Saving parking lot data...\n');
  
  const lot1: ParkingLot = {
    id: 'lot-g7',
    name: 'Parking Lot G7 (East Campus)',
    capacity: 450,
    currentOccupancy: 342,
    confidence: 'HIGH',
    lastUpdated: new Date().toISOString(),
  };

  const lot2: ParkingLot = {
    id: 'lot-g8',
    name: 'Parking Lot G8 (West Campus)',
    capacity: 380,
    currentOccupancy: 125,
    confidence: 'MED',
    lastUpdated: new Date().toISOString(),
  };

  await client.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(lot1),
    })
  );
  console.log('[SAVED]', lot1.name);

  await client.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(lot2),
    })
  );
  console.log('[SAVED]', lot2.name);

  // READ - Retrieve single item
  console.log('\n[STEP 2] READ - Retrieving specific parking lot...\n');
  
  const getResult = await client.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ id: 'lot-g7' }),
    })
  );

  if (getResult.Item) {
    const retrievedLot = unmarshall(getResult.Item) as ParkingLot;
    console.log('Retrieved lot:', retrievedLot.name);
    console.log('   Capacity:', retrievedLot.capacity);
    console.log('   Current Occupancy:', retrievedLot.currentOccupancy);
    console.log(
      '   Availability:',
      retrievedLot.capacity - retrievedLot.currentOccupancy,
      'spots'
    );
    console.log('   Confidence:', retrievedLot.confidence);
  }

  // READ ALL - Scan all items
  console.log('\n[STEP 3] READ ALL - Retrieving all parking lots...\n');
  
  const scanResult = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    })
  );

  console.log(`Found ${scanResult.Items?.length || 0} parking lots:\n`);
  scanResult.Items?.forEach((item) => {
    const lot = unmarshall(item) as ParkingLot;
    const availableSpots = lot.capacity - lot.currentOccupancy;
    const percentFull = ((lot.currentOccupancy / lot.capacity) * 100).toFixed(1);
    
    console.log(`   - ${lot.name}`);
    console.log(`     ${lot.currentOccupancy}/${lot.capacity} spots used (${percentFull}%)`);
    console.log(`     ${availableSpots} spots available - Confidence: ${lot.confidence}`);
    console.log('');
  });

  // UPDATE - Modify existing item
  console.log('[STEP 4] UPDATE - Updating occupancy for Lot G7...\n');
  
  const newOccupancy = 280;
  await client.send(
    new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ id: 'lot-g7' }),
      UpdateExpression:
        'SET currentOccupancy = :occ, lastUpdated = :time, confidence = :conf',
      ExpressionAttributeValues: marshall({
        ':occ': newOccupancy,
        ':time': new Date().toISOString(),
        ':conf': 'HIGH',
      }),
    })
  );

  // Verify update
  const updatedResult = await client.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ id: 'lot-g7' }),
    })
  );

  if (updatedResult.Item) {
    const updatedLot = unmarshall(updatedResult.Item) as ParkingLot;
    console.log('[SUCCESS] Updated successfully!');
    console.log('   New occupancy:', updatedLot.currentOccupancy);
    console.log('   Available spots:', updatedLot.capacity - updatedLot.currentOccupancy);
  }

  // DELETE - Remove item
  console.log('\n[STEP 5] DELETE - Removing Lot G8...\n');
  
  await client.send(
    new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ id: 'lot-g8' }),
    })
  );
  console.log('[DELETED] Parking Lot G8');

  // Final scan
  console.log('\n[STEP 6] FINAL STATE - All remaining lots:\n');
  
  const finalScan = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    })
  );

  console.log(`Total lots in database: ${finalScan.Items?.length || 0}\n`);
  finalScan.Items?.forEach((item) => {
    const lot = unmarshall(item) as ParkingLot;
    console.log(`   - ${lot.name} - ${lot.currentOccupancy}/${lot.capacity} spots used`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('Demo completed. All CRUD operations successful.\n');
}

demoCRUDOperations().catch((error) => {
  console.error('\n[ERROR] Error during demo:', error);
  console.error('\nMake sure:');
  console.error('   1. Docker is running');
  console.error('   2. DynamoDB Local is started: ./scripts/start-local.sh');
  console.error('   3. Table is created: pnpm db:setup\n');
  process.exit(1);
});
