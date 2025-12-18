import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import type { Response } from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

describe('WeatherController (e2e)', () => {
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

  describe('/api/v1/weather/current (GET)', () => {
    it('should return current weather data', () => {
      return request(app.getHttpServer())
        .get('/api/v1/weather/current')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('date');
          expect(res.body.data).toHaveProperty('condition');
          expect(res.body.data).toHaveProperty('temperature_f');
          expect(res.body.data).toHaveProperty('precipitation_probability');
          expect(res.body.data).toHaveProperty('wind_mph');
          expect(res.body.data).toHaveProperty('parking_impact_factor');
        });
    });

    it('should include 7-day forecast', () => {
      return request(app.getHttpServer())
        .get('/api/v1/weather/current')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data.forecast_7day)).toBe(true);
          expect(res.body.data.forecast_7day.length).toBe(7);
          
          // Verify forecast structure
          const forecast = res.body.data.forecast_7day[0];
          expect(forecast).toHaveProperty('date');
          expect(forecast).toHaveProperty('condition');
          expect(forecast).toHaveProperty('temp_high_f');
          expect(forecast).toHaveProperty('precipitation_probability');
          expect(forecast).toHaveProperty('parking_impact_factor');
        });
    });

    it('should have parking impact factor between 0.5 and 1.5', () => {
      return request(app.getHttpServer())
        .get('/api/v1/weather/current')
        .expect(200)
        .expect((res: Response) => {
          const impactFactor = res.body.data.parking_impact_factor;
          expect(impactFactor).toBeGreaterThanOrEqual(0.5);
          expect(impactFactor).toBeLessThanOrEqual(1.5);
          
          // Check forecast impact factors too
          res.body.data.forecast_7day.forEach((day: { parking_impact_factor: number }) => {
            expect(day.parking_impact_factor).toBeGreaterThanOrEqual(0.5);
            expect(day.parking_impact_factor).toBeLessThanOrEqual(1.5);
          });
        });
    });

    it('should indicate rainy weather increases parking demand', () => {
      return request(app.getHttpServer())
        .get('/api/v1/weather/current')
        .expect(200)
        .expect((res: Response) => {
          // Find rainy day in forecast
          const rainyDay = res.body.data.forecast_7day.find(
            (day: { condition: string }) => day.condition === 'Rainy'
          );
          
          if (rainyDay) {
            // Rainy weather should have impact factor > 1.0 (increased demand)
            expect(rainyDay.parking_impact_factor).toBeGreaterThan(1.0);
          }
        });
    });
  });
});
