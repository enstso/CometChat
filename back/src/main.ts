import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Bootstrap function to initialize and start the NestJS application
async function bootstrap() {
  // Create the application instance using the root AppModule
  const app = await NestFactory.create(AppModule);

  // Enable Cross-Origin Resource Sharing (CORS) with specified options
  app.enableCors({
    origin: '*', // Allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Accept, Authorization', // Allowed headers
    credentials: true, // Allow credentials such as cookies
  });

  // Start listening on the specified port or default to 3000
  await app.listen(process.env.PORT ?? 3000);

  // Log the URL where the GraphQL endpoint is accessible
  console.log(`🚀 Application running on: http://localhost:3000/graphql`);
}

// Call bootstrap and handle success or errors during app startup
bootstrap()
  .then(() => {
    console.log('NestJS application has started successfully.');
  })
  .catch((error) => {
    console.error('Error starting NestJS application:', error);
  });
