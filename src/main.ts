import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new ConsoleLogger({
    //   prefix: 'CashFlow',
    //   colors: true,
    //   json: true,
    //   timestamp: false,
    // }),
  });
  app.enableCors();
  app.use(cookieParser());
  app.setGlobalPrefix('/api/v1');
  await app.listen(process.env.HTTP_PORT ?? 8080);
}

bootstrap();
