/* eslint-disable @typescript-eslint/explicit-function-return-type */

import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Get,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { FileUpload } from '../schemas/file_upload.schema';

@Controller('fileUpload')
@ApiTags('FileUpload')
export class FileUploadController {
  constructor(private readonly appService: FileUploadService) {}

  @ApiOperation({
    summary: 'Upload and process file',
  })
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBom(@UploadedFile('file') file, @Body() { providerName }) {
    return this.appService.upload(file, providerName);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all the files',
  })
  async findAll(): Promise<FileUpload[]> {
    return this.appService.findAll();
  }
}
