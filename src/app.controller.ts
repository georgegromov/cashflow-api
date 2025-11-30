import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { type Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getStatus(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ status: 'available' });
  }
}
