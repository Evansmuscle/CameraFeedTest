import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['*', 'http://localhost:3000'],
      methods: ['POST', 'GET'],
    },
  });

  await app.listen(3001);
}
bootstrap();
