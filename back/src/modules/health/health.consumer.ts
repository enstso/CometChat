import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('health-check-queue') // Decorator to define the queue this processor listens to
export class HealthConsumer extends WorkerHost {
  // Method to process jobs from the queue
  process(job: Job<any, any, string>): Promise<void> {
    if (job.name === 'health-check') {
      // Log when a health-check job is received
      console.log('Health check job received (consumer):');
      console.log('✅ Processing job:', job.name);
      console.log('📦 Data:', job.data);
    }
    // Resolve the promise to indicate job processing is done
    return Promise.resolve();
  }
}
