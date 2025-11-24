# Submission 1, Step 4: DynamoDB CRUD Demo

This guide shows you how to demonstrate **saving and retrieving data** from the central database (DynamoDB Local) for **CECS 491A Submission 1, Step 4**.

## Prerequisites

1. Docker Desktop running
2. Repository cloned with access
3. Dependencies installed (`pnpm install`)

## Quick Demo (3 Simple Steps)

### Step 1: Start Local Infrastructure

```bash
./scripts/start-local.sh
```

**Expected output:**
```
Local infra up (DynamoDB + LocalStack)
```

### Step 2: Create Database Table

```bash
pnpm db:setup
```

**Expected output:**
```
Setting up DynamoDB tables...
Region: us-west-2
Endpoint: http://localhost:8000
Creating table: sharkpark-parking-lots
[SUCCESS] Table created successfully: sharkpark-parking-lots
Setup complete!
```

**Take a screenshot of this output**

### Step 3: Run CRUD Demo

```bash
pnpm db:demo
```

**Expected output:**
```
DynamoDB CRUD Demo - Submission 1, Step 4

[STEP 1] CREATE - Saving parking lot data...
[SAVED] Parking Lot G7 (East Campus)
[SAVED] Parking Lot G8 (West Campus)

[STEP 2] READ - Retrieving specific parking lot...
Retrieved lot: Parking Lot G7 (East Campus)
   Capacity: 450
   Current Occupancy: 342
   Availability: 108 spots

[STEP 3] READ ALL - Retrieving all parking lots...
Found 2 parking lots:
   - Parking Lot G8 (West Campus)
     125/380 spots used (32.9%)
   - Parking Lot G7 (East Campus)
     342/450 spots used (76.0%)

[STEP 4] UPDATE - Updating occupancy for Lot G7...
[SUCCESS] Updated successfully!
   New occupancy: 280

[STEP 5] DELETE - Removing Lot G8...
[DELETED] Parking Lot G8

[STEP 6] FINAL STATE - All remaining lots:
Total lots in database: 1
   - Parking Lot G7 (East Campus) - 280/450 spots used

Demo complete! All CRUD operations successful.
```

**Take a screenshot of this full output**
```

📸 **Take a screenshot of this full output**

---

## What the Demo Shows

This demo proves you can:

- ✅ **CREATE**: Save parking lot data to DynamoDB
- ✅ **READ**: Retrieve specific parking lots by ID
- ✅ **READ ALL**: Scan and list all parking lots
- ✅ **UPDATE**: Modify parking lot occupancy data
- ✅ **DELETE**: Remove parking lots from database

All operations happen in your **local DynamoDB** running in Docker (no AWS account needed).

---

## For Your IDE Screenshot

Open the demo script in your IDE to show the code:

**File:** `scripts/demo-dynamodb-crud.ts`

**Key code sections to show:**

```typescript
// CREATE - Save data
await client.send(
  new PutItemCommand({
    TableName: TABLE_NAME,
    Item: marshall(lot1),
  })
);

// READ - Retrieve data
const getResult = await client.send(
  new GetItemCommand({
    TableName: TABLE_NAME,
    Key: marshall({ id: 'lot-g7' }),
  })
);

// UPDATE - Modify data
await client.send(
  new UpdateItemCommand({
    TableName: TABLE_NAME,
    Key: marshall({ id: 'lot-g7' }),
    UpdateExpression: 'SET currentOccupancy = :occ',
    ExpressionAttributeValues: marshall({ ':occ': newOccupancy }),
  })
);

// DELETE - Remove data
await client.send(
  new DeleteItemCommand({
    TableName: TABLE_NAME,
    Key: marshall({ id: 'lot-g8' }),
  })
);
```

📸 **Take a screenshot of the code in VS Code**

---

## Troubleshooting

### "command not found: tsx"
Use `pnpm db:demo` instead of `tsx` directly

### "Cannot connect to Docker daemon"
Start Docker Desktop application

### "ResourceNotFoundException"
Run `pnpm db:setup` first to create the table

### Port 8000 already in use
```bash
docker stop sharkpark-dynamodb
./scripts/start-local.sh
```

---

## Database Connection Details

- **Database Type:** DynamoDB (NoSQL)
- **Host:** localhost:8000 (DynamoDB Local in Docker)
- **Table Name:** `sharkpark-parking-lots`
- **AWS Region:** us-west-2 (simulated)
- **Credentials:** Local (dummy credentials for development)

---

## Summary for Submission

✅ **Step 1:** Environment Setup - Repository cloned ✓  
✅ **Step 2:** Database Setup - DynamoDB Local running in Docker ✓  
✅ **Step 3:** IDE Setup - VS Code with code visible ✓  
✅ **Step 4:** Demo CRUD Operations - Saving & retrieving data ✓  

**Screenshots needed:**
1. Terminal showing `pnpm db:setup` output
2. Terminal showing `pnpm db:demo` full CRUD output
3. VS Code showing the demo script code
4. (Optional) Docker Desktop showing running containers

---

## Running the Demo Again

You can run the demo multiple times:

```bash
# Reset and run again
pnpm db:setup   # Recreates table (deletes old data)
pnpm db:demo    # Runs CRUD operations
```

Each run will create fresh test data and demonstrate all CRUD operations.
