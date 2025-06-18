import { HealthService } from './health.service';
import { Queue, Job } from 'bullmq';

describe('HealthService', () => {
  let service: HealthService;
  let queueMock: jest.Mocked<Queue>;

  beforeEach(() => {
    queueMock = {
      add: jest.fn(),
    } as any;

    service = new HealthService(queueMock);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should add a job to the queue and return { result: "OK" }', async () => {
      const expectedJob = {
        id: 'job-1',
        name: 'health-check',
        data: { result: 'OK' },
      } as Job;

      queueMock.add.mockResolvedValueOnce(expectedJob); // ✅ simulate a Job

      const result = await service.check();

      expect(queueMock.add).toHaveBeenCalledWith('health-check', {
        result: 'OK',
      });
      expect(console.log).toHaveBeenCalledWith(
        'Health check triggered! (producer)',
      );
      expect(result).toEqual({ result: 'OK' });
    });
  });

  describe('healthCheck', () => {
    it('should return { result: "OK" }', () => {
      expect(service.healthCheck()).toEqual({ result: 'OK' });
    });
  });
});
