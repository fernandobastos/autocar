import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Car extends Document {
  @Prop()
  uuid: string;

  @Prop()
  VIN: string;

  @Prop()
  Make: string;

  @Prop()
  Model: string;

  @Prop()
  Mileage: string;

  @Prop()
  Year: string;

  @Prop()
  Price: string;

  @Prop()
  zipCode: string;

  @Prop()
  createdDate: string;

  @Prop()
  updatedDate: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);
