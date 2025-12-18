import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import type { Response } from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

describe('EventsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.setGlobalPrefix('api/v1');
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/events (GET)', () => {
    it('should return all campus events', () => {
      return request(app.getHttpServer())
        .get('/api/v1/events')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.count).toBeGreaterThan(0);
          expect(Array.isArray(res.body.data)).toBe(true);
          
          // Verify event structure
          const event = res.body.data[0];
          expect(event).toHaveProperty('event_id');
          expect(event).toHaveProperty('event_name');
          expect(event).toHaveProperty('event_type');
          expect(event).toHaveProperty('location_name');
          expect(event).toHaveProperty('start_time');
          expect(event).toHaveProperty('end_time');
          expect(event).toHaveProperty('expected_attendance');
        });
    });

    it('should filter events by type', () => {
      return request(app.getHttpServer())
        .get('/api/v1/events?type=SPORTS')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.success).toBe(true);
          res.body.data.forEach((event: { event_type: string }) => {
            expect(event.event_type).toBe('SPORTS');
          });
        });
    });
  });

  describe('/api/v1/events/:eventId/impacts (GET)', () => {
    it('should return parking impacts for basketball game', () => {
      return request(app.getHttpServer())
        .get('/api/v1/events/basketball-2025-12-15/impacts')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThan(0);
          
          // Verify impact structure
          const impact = res.body.data[0];
          expect(impact).toHaveProperty('lot_id');
          expect(impact).toHaveProperty('impact_level');
          expect(impact).toHaveProperty('expected_fill_rate');
          expect(impact).toHaveProperty('surge_start');
          expect(impact).toHaveProperty('surge_end');
          
          // Verify G2 (closest to Pyramid) has HIGH impact
          const g2Impact = res.body.data.find((i: { lot_id: string }) => i.lot_id === 'G2');
          expect(g2Impact).toBeDefined();
          expect(g2Impact.impact_level).toBe('HIGH');
        });
    });

    it('should return impacts for graduation (EXTREME event)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/events/graduation-2025-05-17/impacts')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.success).toBe(true);
          
          // Graduation should have multiple EXTREME impacts
          const extremeImpacts = res.body.data.filter(
            (i: { impact_level: string }) => i.impact_level === 'EXTREME'
          );
          expect(extremeImpacts.length).toBeGreaterThan(0);
        });
    });

    it('should return empty array for non-existent event', () => {
      return request(app.getHttpServer())
        .get('/api/v1/events/fake-event-123/impacts')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.length).toBe(0);
        });
    });
  });
});
