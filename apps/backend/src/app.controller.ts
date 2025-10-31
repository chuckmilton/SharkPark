import { Controller, Get } from '@nestjs/common';
import { SERVICE_NAME } from './constants';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      ok: true,
      service: SERVICE_NAME,
    };
  }
}
