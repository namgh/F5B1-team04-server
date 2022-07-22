import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Answer } from 'src/apis/answer/entities/answer.entity';
import { Deposit } from 'src/apis/deposit/entities/deposit.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum QUESTION_FIELD_ENUM {
  NORM = 'NORM',
  RESUME = 'RESUME',
  PORTFORLIO = 'PORTFORLIO',
}

registerEnumType(QUESTION_FIELD_ENUM, {
  name: 'QUESTION_FIELD_ENUM',
});

@Entity()
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User)
  @Field(() => User)
  fromUser: User;

  @ManyToOne(() => User)
  @Field(() => User)
  toCoach: User;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  title: string;

  @Column({
    type: 'enum',
    enum: QUESTION_FIELD_ENUM,
    default: QUESTION_FIELD_ENUM.NORM,
  })
  @Field(() => QUESTION_FIELD_ENUM)
  QType: QUESTION_FIELD_ENUM;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  contents: string;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @OneToOne(() => Answer, (answer) => answer.question)
  answer: Answer;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  //릴레이션은 추후에 테스트 시에 문제가 없다면 보류
  // @JoinColumn()
  // @OneToOne(() => Deposit, (deposit) => deposit.question)
  // @Field(() => Deposit)
  @Column()
  deposit: string;
}
