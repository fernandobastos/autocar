import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { FileUploadModule } from './file-uploads/file-upload.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const mongod = new MongoMemoryServer({
          instance: { port: 51888, dbName: 'testing' },
        });
        const uri = await mongod.getConnectionString();
        return {
          uri: uri,
        };
      },
    }),
    FileUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
