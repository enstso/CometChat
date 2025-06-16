import { Controller, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('health') // Define controller with route 'health'
export class HealthController {
  constructor(
    @InjectQueue('health-check-queue') private readonly queue: Queue, // Inject the BullMQ queue named 'health-check-queue'
  ) {}

  @Get() // Define GET endpoint at '/health'
  async check() {
    // Add a job named 'health-check' to the queue with payload { result: 'OK' }
    await this.queue.add('health-check', {
      result: 'OK',
    });
    // Log that health check was triggered from producer side
    console.log('Health check triggered! (producer)');
    // Return a simple JSON response indicating success
    return { result: 'OK' };
  }
}
