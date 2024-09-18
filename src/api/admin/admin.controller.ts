import { Controller, Get } from '@nestjs/common';

@Controller('api/admin')
export class AdminController {
  constructor() {}

  @Get('ping')
  ping() {
    return 'pong';
  }
}
