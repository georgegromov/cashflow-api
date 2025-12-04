import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'Status' })
  @ApiResponse({ status: 200, description: 'status' })
  @Public()
  @Get('status')
  @HttpCode(200)
  getStatus(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ status: 'available' });
  }
}
