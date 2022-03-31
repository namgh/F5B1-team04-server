import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Question } from 'src/apis/question/entities/question.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DEPOSIT_STATUS {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
}

registerEnumType(DEPOSIT_STATUS, {
  name: 'DEPOSIT_STATUS',
});

@Entity()
@ObjectType()
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User)
  @Field(() => User)
  fromUser: User;

  @ManyToOne(() => User)
  @Field(() => User)
  toCoach: User;

  @Column({ default: 0 })
  @Field(() => Int)
  fromAmount: number;

  @Column({ default: 0 })
  @Field(() => Int)
  toAmount: number;

  @Column({
    type: 'enum',
    enum: DEPOSIT_STATUS,
    default: DEPOSIT_STATUS.PENDING,
  })
  @Field(() => DEPOSIT_STATUS)
  status: DEPOSIT_STATUS;

  @CreateDateColumn()
  createdAt: Date;

  // @OneToOne(() => Question, (question) => question.deposit)
  // question: Question
}
