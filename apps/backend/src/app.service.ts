import { Injectable } from '@nestjs/common';
import { SERVICE_NAME } from './constants';

@Injectable()
export class AppService {
  getHealth() {
    return {
      ok: true,
      service: SERVICE_NAME,
    };
  }
}
