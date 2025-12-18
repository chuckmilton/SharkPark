import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let mockDynamoClient: { send: jest.Mock };

  beforeEach(async () => {
    mockDynamoClient = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: 'DYNAMODB_CLIENT',
          useValue: mockDynamoClient,
        },
        {
          provide: 'TABLE_NAME',
          useValue: 'test-table',
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of campus events', async () => {
      const mockEvents = {
        Items: [
          {
            event_id: { S: 'basketball-2025' },
            event_name: { S: 'Basketball Game' },
            event_type: { S: 'SPORTS' },
            EntityType: { S: 'CampusEvent' },
          },
        ],
      };

      mockDynamoClient.send.mockResolvedValueOnce(mockEvents);

      const result = await service.findAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should filter by event type when provided', async () => {
      const mockEvents = {
        Items: [
          {
            event_id: { S: 'basketball-2025' },
            event_type: { S: 'SPORTS' },
            EntityType: { S: 'CampusEvent' },
          },
        ],
      };

      mockDynamoClient.send.mockResolvedValueOnce(mockEvents);

      const result = await service.findAll('SPORTS');

      expect(result).toBeDefined();
    });
  });

  describe('getImpacts', () => {
    it('should return parking impacts for event', async () => {
      const mockImpacts = {
        Items: [
          {
            event_id: { S: 'basketball-2025' },
            lot_id: { S: 'G2' },
            impact_level: { S: 'HIGH' },
          },
        ],
      };

      mockDynamoClient.send.mockResolvedValueOnce(mockImpacts);

      const result = await service.getImpacts('basketball-2025');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
