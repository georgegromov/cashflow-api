import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  ITransactionController,
  type ICreateTransactionDto,
} from './interfaces/transactions.interface';
import { type JwtPayload } from 'src/auth/interfaces/auth.inferface';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('transactions')
export class TransactionsController implements ITransactionController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: ICreateTransactionDto,
    @CurrentUser() curretUser: JwtPayload,
  ) {
    return this.transactionsService.create(
      curretUser.sub,
      createTransactionDto,
    );
  }

  @Get()
  findAll(@CurrentUser() curretUser: JwtPayload) {
    return this.transactionsService.findAll(curretUser.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() curretUser: JwtPayload) {
    return this.transactionsService.findOne(id, curretUser.sub);
  }
}
