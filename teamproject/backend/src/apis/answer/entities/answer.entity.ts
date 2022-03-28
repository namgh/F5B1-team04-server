import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Question } from 'src/apis/question/entities/question.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => Int)
  amount: number;

  @JoinColumn()
  @OneToOne(() => Question, (question) => question.answer)
  @Field(() => Question)
  question: Question;

  @Column({ default: 0 })
  @Field(() => Int)
  likecount: number;

  @Column({ default: 0, readonly: false })
  @Field(() => Int)
  dislikecount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
