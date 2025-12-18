import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockDynamoClient: { send: jest.Mock };

  beforeEach(async () => {
    mockDynamoClient = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException when user not found', async () => {
      mockDynamoClient.send.mockResolvedValueOnce({ Items: [] });

      await expect(service.findOne('invalid@csulb.edu')).rejects.toThrow(NotFoundException);
    });

    it('should return user with favorites when found', async () => {
      const mockUser = {
        Items: [
          {
            user_id: { S: 'test@csulb.edu' },
            first_name: { S: 'Test' },
            last_name: { S: 'User' },
            user_type: { S: 'STUDENT' },
          },
        ],
      };

      const mockFavorites = {
        Items: [
          {
            lot_id: { S: 'G1' },
            user_id: { S: 'test@csulb.edu' },
          },
        ],
      };

      mockDynamoClient.send
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockFavorites);

      const result = await service.findOne('test@csulb.edu');

      expect(result).toBeDefined();
      expect(result.favorites).toEqual(['G1']);
    });
  });

  describe('getFavorites', () => {
    it('should return array of user favorites', async () => {
      const mockFavorites = {
        Items: [
          {
            lot_id: { S: 'G1' },
            user_id: { S: 'test@csulb.edu' },
            added_at: { S: '2025-01-01T00:00:00Z' },
          },
        ],
      };

      mockDynamoClient.send.mockResolvedValueOnce(mockFavorites);

      const result = await service.getFavorites('test@csulb.edu');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when user has no favorites', async () => {
      mockDynamoClient.send.mockResolvedValueOnce({ Items: [] });

      const result = await service.getFavorites('test@csulb.edu');

      expect(result).toEqual([]);
    });
  });

  describe('addFavorite', () => {
    it('should add favorite to DynamoDB', async () => {
      // Mock findOne to return a valid user
      const mockUser = {
        Items: [{ user_id: { S: 'test@csulb.edu' }, first_name: { S: 'Test' } }],
      };
      const mockFavorites = { Items: [] };

      mockDynamoClient.send
        .mockResolvedValueOnce(mockUser)     // findOne query
        .mockResolvedValueOnce(mockFavorites) // getFavorites query
        .mockResolvedValueOnce({});           // PutItemCommand

      await service.addFavorite('test@csulb.edu', 'G1');

      expect(mockDynamoClient.send).toHaveBeenCalledTimes(3);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockDynamoClient.send.mockResolvedValueOnce({ Items: [] });

      await expect(service.addFavorite('invalid@csulb.edu', 'G1'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFavorite', () => {
    it('should remove favorite from DynamoDB', async () => {
      const mockUser = {
        Items: [{ user_id: { S: 'test@csulb.edu' }, first_name: { S: 'Test' } }],
      };
      const mockFavorites = { Items: [] };

      mockDynamoClient.send
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockFavorites)
        .mockResolvedValueOnce({});

      await service.removeFavorite('test@csulb.edu', 'G1');

      expect(mockDynamoClient.send).toHaveBeenCalledTimes(3);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockDynamoClient.send.mockResolvedValueOnce({ Items: [] });

      await expect(service.removeFavorite('invalid@csulb.edu', 'G1'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('updateNotificationPreferences', () => {
    it('should update notification preferences in DynamoDB', async () => {
      const mockUser = {
        Items: [{ user_id: { S: 'test@csulb.edu' }, first_name: { S: 'Test' } }],
      };
      const mockFavorites = { Items: [] };

      mockDynamoClient.send
        .mockResolvedValueOnce(mockUser)     // findOne (verify exists)
        .mockResolvedValueOnce(mockFavorites)
        .mockResolvedValueOnce({})           // UpdateItemCommand
        .mockResolvedValueOnce(mockUser)     // findOne (return updated)
        .mockResolvedValueOnce(mockFavorites);

      const prefs = { favorites_filling: true, surge_alerts: false };
      await service.updateNotificationPreferences('test@csulb.edu', prefs);

      expect(mockDynamoClient.send).toHaveBeenCalledTimes(5);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockDynamoClient.send.mockResolvedValueOnce({ Items: [] });

      await expect(service.updateNotificationPreferences('invalid@csulb.edu', {}))
        .rejects.toThrow(NotFoundException);
    });
  });
});
