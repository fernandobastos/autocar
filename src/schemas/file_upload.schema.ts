import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FileUpload extends Document {
  @Prop()
  fileName: string;

  @Prop({ type: Date, default: Date.now })
  uploadedDate: Date;

  @Prop()
  buffer: string;

  @Prop()
  providerName: string;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);
