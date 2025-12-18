import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SERVICE_NAME } from './constants';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return health check with ok status and service name', () => {
    expect(appController.health()).toEqual({
      ok: true,
      service: SERVICE_NAME,
    });
  });
});
