import { HealthConsumer } from './health.consumer';
import { Job } from 'bullmq';

describe('HealthConsumer', () => {
  let consumer: HealthConsumer;

  beforeEach(() => {
    consumer = new HealthConsumer();
    jest.spyOn(console, 'log').mockImplementation(() => {}); // silence logs
  });

  afterEach(() => {
    jest.restoreAllMocks(); // clean up mocks
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should process a health-check job and log output', async () => {
    const job: Job = {
      name: 'health-check',
      data: { status: 'ok' },
    } as any;

    await expect(consumer.process(job)).resolves.toBeUndefined();

    expect(console.log).toHaveBeenCalledWith(
      'Health check job received (consumer):',
    );
    expect(console.log).toHaveBeenCalledWith(
      '✅ Processing job:',
      'health-check',
    );
    expect(console.log).toHaveBeenCalledWith('📦 Data:', { status: 'ok' });
  });

  it('should not log for other job names', async () => {
    const job: Job = {
      name: 'other-task',
      data: { anything: 'else' },
    } as any;

    await expect(consumer.process(job)).resolves.toBeUndefined();

    expect(console.log).not.toHaveBeenCalledWith(
      'Health check job received (consumer):',
    );
  });
});
