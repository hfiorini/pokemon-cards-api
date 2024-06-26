import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from './card.entity';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cardsService.findOne(id);
  }

  @Post()
  create(@Body() card: Card) {
    return this.cardsService.create(card);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() card: Partial<Card>) {
    return this.cardsService.update(id, card);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.cardsService.delete(id);
  }

  @Post('battle')
  battle(@Body() battleInfo: { cardId: number; opponentId: number }) {
    return this.cardsService.battle(battleInfo.cardId, battleInfo.opponentId);
  }
}
