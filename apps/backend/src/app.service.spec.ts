import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { SERVICE_NAME } from './constants';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status with ok true', () => {
      const result = service.getHealth();
      
      expect(result).toHaveProperty('ok', true);
      expect(result).toHaveProperty('service', SERVICE_NAME);
    });

    it('should return service name from constants', () => {
      const result = service.getHealth();
      
      expect(result.service).toBe(SERVICE_NAME);
    });
  });
});
