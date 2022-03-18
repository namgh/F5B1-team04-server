import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum USER_TYPE_ENUM {
  USER = 'USER',
  COACH = 'COACH',
  ADMIN = 'ADMIN',
}

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Int)
  phoneNumber: number;

  @Column()
  @Field(() => String)
  password: string;

  score: number;

  point: number;

  status: USER_TYPE_ENUM;

  @Column()
  @Field(() => String)
  codeInterest: string;

  @Column()
  @Field(() => String)
  coachInterest: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
