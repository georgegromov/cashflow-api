export interface ITransactionEntity {}

export interface ICreateTransactionDto {}

export interface ITransactionService {
  create();
  findAll();
  findOne(id: string);
}

export interface ITransactionController {}
