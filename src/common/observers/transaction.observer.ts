import { Transaction } from "src/transactions/entities/transaction.entity";

/**
 * Интерфейс наблюдателя для событий транзакций
 * Реализует паттерн Observer
 */
export interface ITransactionObserver {
  /**
   * Обработка события создания транзакции
   */
  onTransactionCreated(transaction: Transaction): Promise<void> | void;

  /**
   * Обработка события обновления транзакции
   */
  onTransactionUpdated(transaction: Transaction): Promise<void> | void;

  /**
   * Обработка события удаления транзакции
   */
  onTransactionDeleted(transactionId: string): Promise<void> | void;
}

/**
 * Абстрактный класс наблюдателя транзакций
 * Предоставляет базовую реализацию интерфейса
 */
export abstract class AbstractTransactionObserver
  implements ITransactionObserver
{
  abstract onTransactionCreated(transaction: Transaction): Promise<void> | void;

  abstract onTransactionUpdated(transaction: Transaction): Promise<void> | void;

  abstract onTransactionDeleted(transactionId: string): Promise<void> | void;
}

/**
 * Субъект для управления наблюдателями
 * Реализует паттерн Observer
 */
export class TransactionSubject {
  private observers: ITransactionObserver[] = [];

  /**
   * Добавить наблюдателя
   */
  attach(observer: ITransactionObserver): void {
    this.observers.push(observer);
  }

  /**
   * Удалить наблюдателя
   */
  detach(observer: ITransactionObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Уведомить всех наблюдателей о создании транзакции
   */
  async notifyTransactionCreated(transaction: Transaction): Promise<void> {
    const tasks = this.observers.map((observer) =>
      Promise.resolve(observer.onTransactionCreated(transaction)),
    );
    await Promise.all(tasks);
  }

  /**
   * Уведомить всех наблюдателей об обновлении транзакции
   */
  async notifyTransactionUpdated(transaction: Transaction): Promise<void> {
    const tasks = this.observers.map((observer) =>
      Promise.resolve(observer.onTransactionUpdated(transaction)),
    );
    await Promise.all(tasks);
  }

  /**
   * Уведомить всех наблюдателей об удалении транзакции
   */
  async notifyTransactionDeleted(transactionId: string): Promise<void> {
    const tasks = this.observers.map((observer) =>
      Promise.resolve(observer.onTransactionDeleted(transactionId)),
    );
    await Promise.all(tasks);
  }
}
