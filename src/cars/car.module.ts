import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { CarSchema, Car } from '../schemas/car.schema';
import { MulterConfig } from '../file-uploads/multer-config';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    MulterModule.registerAsync({
      useClass: MulterConfig,
    }),
  ],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
