import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';

@ApiTags('App')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'Status' })
  @ApiResponse({ status: 200, description: 'status' })
  @Get()
  @HttpCode(200)
  getStatus(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ status: 'available' });
  }
}
