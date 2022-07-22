import { Field, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/apis/answer/entities/answer.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class AnswerLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Answer)
  @Field(() => Answer)
  answer: Answer;

  @Column({ default: false })
  @Field(() => Boolean)
  isLike: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  idDislike: boolean;
}
