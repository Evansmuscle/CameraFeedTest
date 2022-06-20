import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('consumer')
  async consume(@Req() req: Request) {
    return this.appService.consume(req);
  }

  @Post('broadcast')
  async broadcast(@Req() req: Request) {
    return this.appService.broadcast(req);
  }
}
