import { Injectable, HttpException } from "@nestjs/common";
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from "@nestjs/platform-express";
import * as path from "path";

@Injectable()
export class MulterConfig implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter: (req, file, cb) => {
        //reject files where extensions does not contain csv
        if (path.extname(file.originalname).toLowerCase() !== ".csv") {
          return cb(new HttpException("CSV files only", 400), false);
        }
        return cb(null, true);
      },
    };
  }
}
