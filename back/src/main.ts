import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application running on: http://localhost:3000/graphql`);
}
bootstrap()
  .then(() => {
    console.log('NestJS application has started successfully.');
  })
  .catch((error) => {
    console.error('Error starting NestJS application:', error);
  });
