import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('health-check-queue')
export class HealthConsumer extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<void> {
    if (job.name === 'health-check') {
      console.log('Health check job received (consumer):');
      console.log('✅ Processing job:', job.name);
      console.log('📦 Data:', job.data);
    }
  }
}
