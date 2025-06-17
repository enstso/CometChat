import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Define a controller to handle HTTP requests at the root path
@Controller()
export class AppController {
  // Inject the AppService to use its methods
  constructor(private readonly appService: AppService) {}

  // Define a GET endpoint at /health to perform a health check
  @Get('health')
  healthCheck(): string {
    // Return the result of the healthCheck method from the service
    return this.appService.healthCheck();
  }
}
