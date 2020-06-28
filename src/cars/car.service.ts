import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from '../schemas/car.schema';

@Injectable()
export class CarService {
  constructor(@InjectModel(Car.name) private carModel: Model<Car>) {}

  async createBulk(data): Promise<any> {
    return this.carModel.collection.insertMany(data);
  }

  async findAll(): Promise<any[]> {
    return this.carModel.find().exec();
  }
}
