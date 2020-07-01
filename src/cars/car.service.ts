import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Car } from "../schemas/car.schema";

@Injectable()
export class CarService {
  constructor(@InjectModel(Car.name) private carModel: Model<Car>) {}

  /**
   * Create cars given an array of data
   * @function
   * @param data Array of car objects to save.
   * @returns Promise with all the saved cars
   */
  async createBulk(data: any): Promise<any> {
    return this.carModel.collection.insertMany(data);
  }

  /**
   * Finds all cars
   * @function
   * @returns Promise with all cars in the db
   */
  async findAll(): Promise<Car[]> {
    return this.carModel.find().exec();
  }
}
