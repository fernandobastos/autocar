/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CarService } from './car.service';

@Controller('car')
@ApiTags('Car')
export class CarController {
  constructor(private readonly appService: CarService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all the files',
  })
  async findAll(): Promise<any[]> {
    return this.appService.findAll();
  }
}
