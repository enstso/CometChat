import { Controller, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('health')
export class HealthController {
  constructor(
    @InjectQueue('health-check-queue') private readonly queue: Queue,
  ) {}

  @Get()
  async check() {
    await this.queue.add('health-check', {
      result: 'OK',
    });
    console.log('Health check triggered! (producer)');
    return { result: 'OK' };
  }
}
