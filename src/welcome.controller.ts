import { Controller, Get, HttpCode } from '@nestjs/common';
import { HelperService } from './common/helper/helper.service';

@Controller()
export class WelcomeController {
  constructor(private readonly helperService: HelperService) {}

  @Get('/')
  // @ApiOperation({ summary: 'Welcome to our API' })
  // @ApiSuccessResponse()
  // @ApiInvalidInputResponse()
  index() {
    return {
      status: 200,
      message: 'Welcome to our API!',
      data: {
        timestamp: this.helperService.now(),
      },
    };
  }
}
