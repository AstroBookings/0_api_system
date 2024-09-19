import { Controller, Get, Logger } from '@nestjs/common';

/**
 * Admin controller for testing arrangements
 */
@Controller('api/admin')
export class AdminController {
  readonly #logger = new Logger(AdminController.name);

  constructor() {}

  /**
   * Ping endpoint to check if the admin controller is running
   *
   * 📦 'pong' if the controller is running
   */
  @Get('ping')
  ping() {
    this.#logger.verbose('Ping request received');
    return 'pong';
  }
}
