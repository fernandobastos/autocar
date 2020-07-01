import { Test, TestingModule } from "@nestjs/testing";
import { FileUploadController } from "../../file-uploads/file-upload.controller";
import { FileUploadService } from "../../file-uploads/file-upload.service";
import { FileUpload } from "../../schemas/file_upload.schema";
import { getModelToken } from "@nestjs/mongoose";
import { CarService } from "../../cars/car.service";
import { Car } from "../../schemas/car.schema";
import { Model } from "mongoose";

describe("FileUploadService", () => {
  let service: FileUploadService;
  let repo: Model<FileUpload>;

  const filesMock = [
    {
      fileName: "test.csv",
      buffer:
        "UUID,VIN,Make,Model,Mileage,Year,Price,Zip Code,Create Date,Update Date\n1,2,3,4,5,6,7,8,9,10",
      providerName: "test",
      uploadedDate: "2020-01-01",
    },
  ];

  const carModel = {
    find() {
      return "";
    },
  };

  beforeEach(async () => {
    function fileUploadModel() {
      this.find = () => {
        return {
          exec() {
            return filesMock;
          },
        };
      };
      this.save = () => {
        return {
          _id: "5ef7a104cf70e243a138a53c",
          fileName: "testfile.csv",
          buffer:
            "UUID,VIN,Make,Model,Mileage,Year,Price,Zip Code,Create Date,Update Date\r\n1,2,3,4,5,6,7,8,9,10",
          providerName: "test",
          uploadedDate: 1593286916610,
          __v: 0,
        };
      };
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [
        FileUploadService,
        {
          provide: getModelToken(FileUpload.name),
          useValue: new fileUploadModel(),
        },
        CarService,
        {
          provide: getModelToken(Car.name),
          useValue: carModel,
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should parse a file", () => {
    const fileMock = {
      buffer: Buffer.from(
        `UUID,VIN,Make,Model,Mileage,Year,Price,Zip Code,Create Date,Update Date
         1,2,3,4,5,6,7,8,9,10`,
        "utf8"
      ),
    };
    const parsedFile = service.parseFile(fileMock);
    expect(parsedFile).toEqual([
      {
        createDate: "Create Date",
        make: "Make",
        mileage: "Mileage",
        model: "Model",
        price: "Price",
        updateDate: "Update Date",
        uuid: "UUID",
        vin: "VIN",
        year: "Year",
        zipCode: "Zip Code",
      },
      {
        createDate: "9",
        make: "3",
        mileage: "5",
        model: "4",
        price: "7",
        updateDate: "10",
        uuid: "1",
        vin: "2",
        year: "6",
        zipCode: "8",
      },
    ]);
  });
});
