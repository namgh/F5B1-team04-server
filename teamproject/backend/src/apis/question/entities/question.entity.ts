import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum QUESTION_FIELD_ENUM {
  NORM = 'NORM',
  RESUME = 'RESUMNE',
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

  @Column()
  @Field(() => String)
  title: string;

  @Column({
    type: 'enum',
    enum: QUESTION_FIELD_ENUM,
    default: QUESTION_FIELD_ENUM.NORM,
  })
  @Field(() => QUESTION_FIELD_ENUM)
  QType: QUESTION_FIELD_ENUM;

  @Column()
  @Field(() => String)
  contents: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
