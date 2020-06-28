import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { FileUpload, FileUploadSchema } from '../schemas/file_upload.schema';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfig } from './multer-config';
import { CarSchema } from '../schemas/car.schema';
import { CarModule } from '../cars/car.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileUpload.name, schema: FileUploadSchema },
      { name: 'Car', schema: CarSchema },
    ]),
    MulterModule.registerAsync({
      useClass: MulterConfig,
    }),
    CarModule,
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
