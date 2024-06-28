import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import process from "node:process";

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {  },);
  const config = new DocumentBuilder()
    .setTitle('Pokemon Cards API')
    .setDescription('API for managing Pokemon cards')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  let port = 3000
  if (process != null && process.env !== null){
    port = Number(process.env.PORT)
  }
  await app.listen(port);
}
bootstrap();
