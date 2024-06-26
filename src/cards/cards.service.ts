import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Card } from './card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  findAll(): Promise<Card[]> {
    return this.cardsRepository.find();
  }

  findOne(id: number): Promise<Card> {
    return this.cardsRepository.findOne({ where: { id } });
  }

  create(card: Card): Promise<Card> {
    return this.cardsRepository.save(card);
  }

  update(id: number, card: Partial<Card>): Promise<Card> {
    this.cardsRepository.update(id, card);
    return this.cardsRepository.findOne({ where: { id } });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.cardsRepository.delete(id);
  }

  async battle(cardId: number, opponentId: number): Promise<string> {
    const card = await this.cardsRepository.findOne({ where: { id: cardId } });
    const opponent = await this.cardsRepository.findOne({
      where: { id: opponentId },
    });

    if (!card || !opponent) {
      throw new Error('Card not found');
    }

    let multiplier = 1;
    if (opponent.weaknesses.includes(card.type)) {
      multiplier = 2;
    } else if (opponent.resistances.includes(card.type)) {
      multiplier = 0.5;
    }

    const damage = card.attack * multiplier;
    return damage >= opponent.hp ? 'Victory' : 'Defeat';
  }
}
