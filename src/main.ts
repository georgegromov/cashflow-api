import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';

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

  const document = new DocumentBuilder()
    .setTitle('CashFlowApi')
    .setDescription('API description')
    .setVersion('1.0')
    .setBasePath('/api/v1')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, document, {
      include: [AuthModule, UsersModule, CategoriesModule, TransactionsModule],
      ignoreGlobalPrefix: false,
    });
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/download',
    useGlobalPrefix: true,
    customSiteTitle: 'CashFlow API Swagger',
  });

  await app.listen(process.env.HTTP_PORT ?? 8080);
}

bootstrap();
