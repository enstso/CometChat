import { Query, Resolver } from '@nestjs/graphql';
import { HealthCheckResponse } from './dto/health-check-response';

@Resolver()
export class HealthResolver {
  // This resolver can be expanded with more health-related queries or mutations in the future.
  @Query(() => HealthCheckResponse)
  healthCheck(): HealthCheckResponse {
    return { result: 'OK' };
  }
}
