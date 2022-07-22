import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { Answer } from 'src/apis/answer/entities/answer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ORDER_STATUS {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

registerEnumType(ORDER_STATUS, {
  name: 'ORDER_STATUS',
});

@Entity()
@ObjectType()
export class OrderHistory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Answer)
  @Field(() => Answer)
  answer: Answer;

  @Column()
  @Field(() => Int)
  amount: number;

  @Column({ type: 'enum', enum: ORDER_STATUS })
  @Field(() => ORDER_STATUS)
  status: ORDER_STATUS;

  @CreateDateColumn()
  createdAt: Date;
}
