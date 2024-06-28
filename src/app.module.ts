import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModule } from './cards/cards.module';
import { Card } from './cards/card.entity';
import * as process from "node:process";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5433,
      username: process.env.DATABASE_USERNAME|| 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: 'pokemon',
      entities: [Card],
      synchronize: true,
    }),
    CardsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

