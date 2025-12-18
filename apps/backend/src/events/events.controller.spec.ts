import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEventsService = {
    findAll: jest.fn(),
    getImpacts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllEvents', () => {
    it('should return array of events', async () => {
      const mockEvents = [
        {
          event_id: 'basketball-2025',
          event_name: 'Basketball Game',
          event_type: 'SPORTS',
        },
      ];

      mockEventsService.findAll.mockResolvedValue(mockEvents);

      const result = await controller.getAllEvents();

      expect(result).toEqual({
        success: true,
        count: mockEvents.length,
        data: mockEvents,
      });
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should filter by event type when provided', async () => {
      mockEventsService.findAll.mockResolvedValue([]);

      await controller.getAllEvents('SPORTS');

      expect(service.findAll).toHaveBeenCalledWith('SPORTS');
    });
  });

  describe('getEventImpacts', () => {
    it('should return parking impacts for event', async () => {
      const mockImpacts = [
        {
          event_id: 'basketball-2025',
          lot_id: 'G2',
          impact_level: 'HIGH',
        },
      ];

      mockEventsService.getImpacts.mockResolvedValue(mockImpacts);

      const result = await controller.getEventImpacts('basketball-2025');

      expect(result).toEqual({
        success: true,
        event_id: 'basketball-2025',
        count: mockImpacts.length,
        data: mockImpacts,
      });
      expect(service.getImpacts).toHaveBeenCalledWith('basketball-2025');
    });
  });
});
