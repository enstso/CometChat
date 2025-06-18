import { Injectable } from '@nestjs/common'; // Import Injectable decorator from NestJS
import { InjectQueue } from '@nestjs/bullmq'; // Import decorator to inject a BullMQ queue
import { Queue } from 'bullmq'; // Import Queue class from BullMQ
import { HealthCheckResponse } from './dto/health-check-response'; // Import the DTO for the health check response

@Injectable() // Marks this class as a provider that can be injected
export class HealthService {
  constructor(
    @InjectQueue('health-check-queue') private readonly queue: Queue, // Injects the 'health-check-queue' BullMQ queue
  ) {}

  async check() {
    // Add a job to the 'health-check-queue' with a payload
    await this.queue.add('health-check', {
      result: 'OK',
    });
    // Log a message indicating the health check was triggered
    console.log('Health check triggered! (producer)');
    // Return a simple OK response
    return { result: 'OK' };
  }

  healthCheck(): HealthCheckResponse {
    // Return a health check response object
    return { result: 'OK' };
  }
}
