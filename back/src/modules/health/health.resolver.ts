import { Query, Resolver } from '@nestjs/graphql';
import { HealthCheckResponse } from './dto/health-check-response';
import { HealthService } from './health.service';

@Resolver()
export class HealthResolver {
  constructor(private readonly healthService: HealthService) {}
  @Query(() => HealthCheckResponse)
  healthCheck(): HealthCheckResponse {
    return this.healthService.healthCheck();
  }
}
