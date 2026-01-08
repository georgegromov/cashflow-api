import { ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyticsQueryDto {
  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Начальная дата периода (формат: YYYY-MM-DD)',
    type: String,
  })
  startDate?: string;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Конечная дата периода (формат: YYYY-MM-DD)',
    type: String,
  })
  endDate?: string;
}
