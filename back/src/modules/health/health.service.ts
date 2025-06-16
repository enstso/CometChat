import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { HealthCheckResponse } from './dto/health-check-response';
@Injectable()
export class HealthService {
  constructor(
    @InjectQueue('health-check-queue') private readonly queue: Queue,
  ) {}

  async check() {
    await this.queue.add('health-check', {
      result: 'OK',
    });
    console.log('Health check triggered! (producer)');
    return { result: 'OK' };
  }

  healthCheck(): HealthCheckResponse {
    return { result: 'OK' };
  }
}
