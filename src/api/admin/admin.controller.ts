import { Controller, Get, Logger } from '@nestjs/common';

@Controller('api/admin')
export class AdminController {
  private readonly logger = new Logger('AdminController');

  constructor() {}

  @Get('ping')
  ping() {
    this.logger.verbose('Ping request received');
    return 'pong';
  }
}
