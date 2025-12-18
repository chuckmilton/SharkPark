import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let mockDynamoClient: { send: jest.Mock };

  beforeEach(async () => {
    mockDynamoClient = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
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

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrent', () => {
    it('should return current weather data', async () => {
      const mockWeather = {
        Items: [
          {
            condition: { S: 'Sunny' },
            temperature: { N: '72' },
            humidity: { N: '45' },
          },
        ],
      };

      mockDynamoClient.send.mockResolvedValueOnce(mockWeather);

      const result = await service.getCurrent();

      expect(result).toBeDefined();
    });

    it('should return null when no weather data found', async () => {
      mockDynamoClient.send.mockResolvedValueOnce({ Items: [] });

      const result = await service.getCurrent();

      expect(result).toBeNull();
    });
  });
});
