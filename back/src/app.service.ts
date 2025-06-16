import { Injectable } from '@nestjs/common';

// Service class to provide application-wide functionalities
@Injectable()
export class AppService {
  // Method to perform a health check, returning a simple status string
  healthCheck(): string {
    return 'OK'; // Indicate that the service is running correctly
  }
}
