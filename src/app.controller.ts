import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('generate-data')
  async generateData(@Body() data: any) {
    try {
      const response = await this.appService.generateData(data).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
