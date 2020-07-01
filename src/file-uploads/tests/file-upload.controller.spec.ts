import { Test, TestingModule } from "@nestjs/testing";
import { FileUploadController } from "../../file-uploads/file-upload.controller";
import { FileUploadService } from "../../file-uploads/file-upload.service";
import { FileUpload } from "../../schemas/file_upload.schema";
import { getModelToken } from "@nestjs/mongoose";
import { CarService } from "../../cars/car.service";
import { Car } from "../../schemas/car.schema";

describe("FileUploadController", () => {
  let controller: FileUploadController;

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

    controller = module.get<FileUploadController>(FileUploadController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should fail upload on empty file ", async () => {
    const fileMock = { buffer: Buffer.from("", "utf8") };
    let thrownError;
    try {
      await controller.uploadBom(fileMock, { providerName: "" });
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError.response.statusCode).toEqual(400);
  });

  it("should return all files", async () => {
    expect(await controller.findAll()).toBe(filesMock);
  });

  describe("Process file upload", () => {
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
            useValue: fileUploadModel,
          },
          CarService,
          {
            provide: getModelToken(Car.name),
            useValue: carModel,
          },
        ],
      }).compile();

      controller = module.get<FileUploadController>(FileUploadController);
    });

    it("should upload file ", async () => {
      const fileMock = {
        originalname: "testfile.csv",
        buffer: Buffer.from(
          `UUID,VIN,Make,Model,Mileage,Year,Price,Zip Code,Create Date,Update Date\r\n
      1,2,3,4,5,6,7,8,9,10`,
          "utf8"
        ),
      };
      const res = await controller.uploadBom(fileMock, { providerName: "tst" });
      expect(res).toEqual({
        _id: "5ef7a104cf70e243a138a53c",
        fileName: "testfile.csv",
        buffer:
          "UUID,VIN,Make,Model,Mileage,Year,Price,Zip Code,Create Date,Update Date\r\n" +
          "1,2,3,4,5,6,7,8,9,10",
        providerName: "test",
        uploadedDate: 1593286916610,
        __v: 0,
      });
    });
  });
});
