import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('AutoFi')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);
  await app.listen(3000);
  console.log(`App running in http://localhost:${port}`);
}
bootstrap();
