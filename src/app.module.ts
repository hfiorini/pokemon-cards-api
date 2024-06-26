import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModule } from './cards/cards.module';
import { Card } from './cards/card.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'your_pass',
      database: 'pokemon',
      entities: [Card],
      synchronize: true,
    }),
    CardsModule,
  ],
})
export class AppModule {}

