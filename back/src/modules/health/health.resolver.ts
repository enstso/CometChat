import { Query, Resolver } from '@nestjs/graphql'; // Import GraphQL decorators from NestJS
import { HealthCheckResponse } from './dto/health-check-response'; // Import the DTO for the health check response
import { HealthService } from './health.service'; // Import the HealthService

@Resolver() // Marks this class as a GraphQL resolver
export class HealthResolver {
  constructor(private readonly healthService: HealthService) {} // Injects the HealthService

  @Query(() => HealthCheckResponse) // Defines a GraphQL query that returns a HealthCheckResponse
  healthCheck(): HealthCheckResponse {
    return this.healthService.healthCheck(); // Calls the healthCheck method from the HealthService
  }
}
