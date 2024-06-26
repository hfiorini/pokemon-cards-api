import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('int')
  attack: number;

  @Column('int')
  defense: number;

  @Column('int')
  hp: number;

  @Column('simple-array')
  weaknesses: string[];

  @Column('simple-array')
  resistances: string[];

  @Column()
  imageUrl: string;
}
