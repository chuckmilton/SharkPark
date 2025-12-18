import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
