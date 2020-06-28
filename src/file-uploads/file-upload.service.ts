import { Model } from "mongoose";
import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FileUpload } from "../schemas/file_upload.schema";
import * as defaultConfiguration from "../../seeds/fileConfiguration.json";
// this configuration should come from the database with the default configuration as seed data
// so that we can add new layout or column configs that map to the car schema
import { Readable } from "stream";
import { CarService } from "../cars/car.service";
import { json } from "express";

@Injectable()
export class FileUploadService {
  constructor(
    @InjectModel(FileUpload.name) private fileUploadModel: Model<FileUpload>,
    private carService: CarService
  ) {}

  async upload(
    file: { originalname: any; buffer: any },
    providerName: string
  ): Promise<FileUpload> {
    if (!file || !file.buffer) {
      throw new BadRequestException("Missing File");
    }
    const parsedFile = this.parseFile(file);
    if (parsedFile.length < 2) {
      //empty when theres less than 2 rows 1st headers all the following are cars data
      throw new BadRequestException(
        "Empty csv file. Please update the file with at least 1 row besides the header"
      );
    }
    parsedFile.shift(); //remove headers from parsed file to save all cars
    const createdFile = new this.fileUploadModel({
      fileName: file.originalname,
      buffer: file.buffer,
      providerName,
    });
    this.carService.createBulk(parsedFile);
    return createdFile.save();
  }

  bufferToStream = (buffer: Buffer): Readable => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  };

  parseFile({ buffer }): any[] {
    const csv = buffer.toString();
    const csvToJson = (csv) => {
      const lines = csv.split("\n");
      const result = [];
      const headers = lines[0].split(",");
      const mappedHeadersToModel = defaultConfiguration.configuration;
      const hasAllHeaders =
        headers.length ===
        Object.keys(defaultConfiguration.configuration).length;

      if (!hasAllHeaders) {
        throw new BadRequestException(
          `Please make sure you have all the following headers ${Object.keys(
            mappedHeadersToModel
          ).toString()}`
        );
      }
      const invalidHeaders = headers.filter(
        (header) =>
          header &&
          header.trim() !== "" &&
          !defaultConfiguration.configuration[header.trim().toUpperCase()]
      );
      if (invalidHeaders.length > 0) {
        throw new BadRequestException(
          `Please fix the following headers ${invalidHeaders.toString()}`
        );
      }
      lines.map((l) => {
        const obj = {};
        const line = l.split(",");
        Object.values(mappedHeadersToModel).forEach((h, i) => {
          obj[h] = line[i];
        });
        result.push(obj);
      });
      return result;
    };
    return csvToJson(csv);
  }

  async findAll(): Promise<FileUpload[]> {
    return this.fileUploadModel.find().exec();
  }
}
