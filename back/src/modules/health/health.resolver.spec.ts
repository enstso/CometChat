import { HealthResolver } from './health.resolver';
import { HealthService } from './health.service';
import { HealthCheckResponse } from './dto/health-check-response';

describe('HealthResolver', () => {
  let resolver: HealthResolver;
  let healthService: jest.Mocked<HealthService>;

  beforeEach(() => {
    healthService = {
      healthCheck: jest.fn(),
    } as any;

    resolver = new HealthResolver(healthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should call healthService.healthCheck and return result', () => {
      const expected: HealthCheckResponse = { result: 'OK' };
      healthService.healthCheck.mockReturnValue(expected);

      const result = resolver.healthCheck();

      expect(healthService.healthCheck).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });
});
