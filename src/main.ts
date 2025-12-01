import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'CashFlow',
      colors: true,
      json: true,
    }),
  });
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.HTTP_PORT ?? 8080);
}

bootstrap();
