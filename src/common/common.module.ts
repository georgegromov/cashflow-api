import { Module, Global, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { DatabaseDataSource } from './data-sources/database.data-source';
import { MockDataSource } from './data-sources/mock.data-source';
import { DataSourceFactoryImpl } from './data-sources/data-source.factory';
import { AnalyticsObserver } from './observers/analytics.observer';
import { TransactionSubject } from './observers/transaction.observer';
import { TransactionRepository } from './repositories/transaction.repository';
import { CategoryRepository } from './repositories/category.repository';

/**
 * Глобальный модуль для общих паттернов и утилит
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Transaction, Category, User]),
  ],
  providers: [
    DatabaseDataSource,
    MockDataSource,
    DataSourceFactoryImpl,
    AnalyticsObserver,
    TransactionSubject,
    TransactionRepository,
    CategoryRepository,
    {
      provide: 'INIT_TRANSACTION_OBSERVERS',
      useFactory: (
        transactionSubject: TransactionSubject,
        analyticsObserver: AnalyticsObserver,
      ) => {
        // Подключаем наблюдателей к субъекту (Observer Pattern)
        transactionSubject.attach(analyticsObserver);
        return true;
      },
      inject: [TransactionSubject, AnalyticsObserver],
    },
  ],
  exports: [
    DatabaseDataSource,
    MockDataSource,
    DataSourceFactoryImpl,
    AnalyticsObserver,
    TransactionSubject,
    TransactionRepository,
    CategoryRepository,
  ],
})
export class CommonModule implements OnModuleInit {
  constructor(
    private readonly transactionSubject: TransactionSubject,
    private readonly analyticsObserver: AnalyticsObserver,
  ) {}

  onModuleInit() {
    // Подключаем наблюдателей при инициализации модуля
    this.transactionSubject.attach(this.analyticsObserver);
  }
}
