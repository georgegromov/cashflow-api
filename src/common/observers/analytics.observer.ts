import { AbstractTransactionObserver } from './transaction.observer';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Наблюдатель для логирования событий транзакций
 * Реализует паттерн Observer
 */
@Injectable()
export class AnalyticsObserver extends AbstractTransactionObserver {
  private readonly logger = new Logger(AnalyticsObserver.name);

  onTransactionCreated(transaction: Transaction): void {
    this.logger.log(
      `Transaction created: ${transaction.id}, Amount: ${transaction.amount}, Type: ${transaction.type}`,
    );
    // Здесь можно добавить логику для обновления аналитики в реальном времени
  }

  onTransactionUpdated(transaction: Transaction): void {
    this.logger.log(`Transaction updated: ${transaction.id}`);
  }

  onTransactionDeleted(transactionId: string): void {
    this.logger.log(`Transaction deleted: ${transactionId}`);
  }
}
