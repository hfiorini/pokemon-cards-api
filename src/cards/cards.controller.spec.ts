import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Card } from './card.entity';

describe('CardsController', () => {
  let controller: CardsController;
  let service: CardsService;

  const mockCard: Card = {
    id: 1,
    name: 'Pikachu',
    type: 'Electric',
    attack: 55,
    defense: 40,
    hp: 35,
    weaknesses: ['Ground'],
    resistances: ['Flying', 'Steel'],
    imageUrl: 'https://example.com/pikachu'
  };

  const mockCardsService = {
    findAll: jest.fn(() => [mockCard]),
    findOne: jest.fn((id: number) => mockCard),
    create: jest.fn((card: Card) => card),
    update: jest.fn((id: number, card: Partial<Card>) => ({ ...mockCard, ...card })),
    delete: jest.fn((id: number) => true),
    battle: jest.fn((cardId: number, opponentId: number) => 'Pikachu wins'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        {
          provide: CardsService,
          useValue: mockCardsService,
        },
      ],
    }).compile();

    controller = module.get<CardsController>(CardsController);
    service = module.get<CardsService>(CardsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all cards', async () => {
    expect(await controller.findAll()).toEqual([mockCard]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one card', async () => {
    expect(await controller.findOne(1)).toEqual(mockCard);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a card', async () => {
    expect(await controller.create(mockCard)).toEqual(mockCard);
    expect(service.create).toHaveBeenCalledWith(mockCard);
  });

  it('should update a card', async () => {
    const updatedCard = { name: 'Raichu' };
    expect(await controller.update(1, updatedCard)).toEqual({ ...mockCard, ...updatedCard });
    expect(service.update).toHaveBeenCalledWith(1, updatedCard);
  });

  it('should delete a card', async () => {
    expect(await controller.delete(1)).toBe(true);
    expect(service.delete).toHaveBeenCalledWith(1);
  });

  it('should simulate a card battle', async () => {
    expect(await controller.battle({ cardId: 1, opponentId: 2 })).toBe('Pikachu wins');
    expect(service.battle).toHaveBeenCalledWith(1, 2);
  });
});
