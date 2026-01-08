import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ITransactionController } from './interfaces/transactions.interface';
import { type JwtPayload } from 'src/auth/interfaces/auth.inferface';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import {
  FinancialAnalyticsDto,
  CategoryAnalyticsDto,
} from './dto/analytics-response.dto';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@ApiCookieAuth('access_token')
@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController implements ITransactionController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
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

  @Get('analytics/financial')
  @ApiOperation({
    summary: 'Получить общую финансовую аналитику',
    description:
      'Возвращает общую статистику: доходы, расходы, баланс и аналитику по категориям. Можно указать период через query параметры startDate и endDate (формат: YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Начальная дата периода (формат: YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Конечная дата периода (формат: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Финансовая аналитика успешно получена',
    type: FinancialAnalyticsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации дат',
  })
  getFinancialAnalytics(
    @CurrentUser() curretUser: JwtPayload,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.transactionsService.getFinancialAnalytics(
      curretUser.sub,
      query.startDate,
      query.endDate,
    );
  }

  @Get('analytics/categories')
  @ApiOperation({
    summary: 'Получить аналитику по категориям',
    description:
      'Возвращает детальную статистику по каждой категории: сумма, количество транзакций, процент от общей суммы. Можно указать период через query параметры startDate и endDate (формат: YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Начальная дата периода (формат: YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Конечная дата периода (формат: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Аналитика по категориям успешно получена',
    type: [CategoryAnalyticsDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации дат',
  })
  getCategoryAnalytics(
    @CurrentUser() curretUser: JwtPayload,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.transactionsService.getCategoryAnalytics(
      curretUser.sub,
      query.startDate,
      query.endDate,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() curretUser: JwtPayload) {
    return this.transactionsService.findOne(id, curretUser.sub);
  }
}
