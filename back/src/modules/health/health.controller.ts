import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health') // Define controller with route 'health'
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get() // Define GET endpoint at '/health'
  async check() {
    await this.healthService.check();
  }
  async healthCheck() {}
}
