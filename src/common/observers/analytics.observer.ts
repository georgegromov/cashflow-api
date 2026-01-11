import {
  AbstractTransactionObserver,
  ITransactionObserver,
} from "./transaction.observer";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { Injectable, Logger } from "@nestjs/common";

/**
 * Наблюдатель для логирования событий транзакций
 * Реализует паттерн Observer
 */
@Injectable()
export class AnalyticsObserver
  extends AbstractTransactionObserver
  implements ITransactionObserver
{
  private readonly logger = new Logger(AnalyticsObserver.name);

  onTransactionCreated(transaction: Transaction): void {
    this.logger.log(
      `Transaction created: ${transaction.id}, Amount: ${transaction.amount}, Type: ${transaction.type}`,
    );
  }

  onTransactionUpdated(transaction: Transaction): void {
    this.logger.log(`Transaction updated: ${transaction.id}`);
  }

  onTransactionDeleted(transactionId: string): void {
    this.logger.log(`Transaction deleted: ${transactionId}`);
  }
}
