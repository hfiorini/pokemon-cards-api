import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardsService } from './cards.service';
import { Card } from './card.entity';

const mockCard: Card = {
  id: 1,
  name: 'Pikachu',
  type: 'Electric',
  attack: 155,
  defense: 40,
  hp: 35,
  weaknesses: ['Ground'],
  resistances: ['Flying', 'Steel'],
  imageUrl: 'https://example.com/pikachu',
};

const mockUpdatedCard: Card = {
  ...mockCard,
  name: 'Raichu',
};

const mockOpponent: Card = {
  id: 2,
  name: 'Bulbasaur',
  type: 'Grass',
  attack: 49,
  defense: 49,
  hp: 45,
  weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
  resistances: ['Water', 'Electric', 'Grass', 'Fighting'],
  imageUrl: 'https://example.com/bulbasaur',
};

const mockCardsRepository = {
  find: jest.fn().mockResolvedValue([mockCard]),
  findOne: jest.fn().mockImplementation(({ where: { id } }) => {
    if (id === 1) {
      return Promise.resolve(mockUpdatedCard);
    }
    if (id === 2) {
      return Promise.resolve(mockOpponent);
    }
    if (id === 3) {
      return Promise.resolve(mockCard);
    }
    return Promise.resolve(null);
  }),
  save: jest.fn().mockResolvedValue(mockCard),
  update: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

describe('CardsService', () => {
  let service: CardsService;
  let repository: Repository<Card>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getRepositoryToken(Card),
          useValue: mockCardsRepository,
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    repository = module.get<Repository<Card>>(getRepositoryToken(Card));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all cards', async () => {
    expect(await service.findAll()).toEqual([mockCard]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return one card', async () => {
    expect(await service.findOne(1)).toEqual(mockUpdatedCard);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should create a card', async () => {
    expect(await service.create(mockCard)).toEqual(mockCard);
    expect(repository.save).toHaveBeenCalledWith(mockCard);
  });

  it('should update a card', async () => {
    const updatedCard = { name: 'Raichu' };
    expect(await service.update(1, updatedCard)).toEqual(mockUpdatedCard);
    expect(repository.update).toHaveBeenCalledWith(1, updatedCard);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should delete a card', async () => {
    expect(await service.delete(1)).toEqual({ affected: 1 });
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should simulate a card battle and return "Victory"', async () => {
    expect(await service.battle(2, 3)).toBe('Victory');
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 3 } });
  });

  it('should simulate a card battle and return "Defeat"', async () => {
    const mockWeakCard: Card = {
      ...mockCard,
      attack: 10,
    };

    mockCardsRepository.findOne = jest.fn().mockImplementation(({ where: { id } }) => {
        if (id === 1) {
          return Promise.resolve(mockWeakCard);
        } else if (id === 2) {
          return Promise.resolve(mockOpponent);
        }
        return Promise.resolve(null);
      });

    expect(await service.battle(1, 2)).toBe('Defeat');
  });

  it('should throw an error if card not found', async () => {
    mockCardsRepository.findOne = jest.fn().mockResolvedValue(null);

    await expect(service.battle(1, 2)).rejects.toThrow('Card not found');
  });
});
