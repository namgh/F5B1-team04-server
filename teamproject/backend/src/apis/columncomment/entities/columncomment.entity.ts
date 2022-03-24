import { Field, ObjectType } from '@nestjs/graphql';
import { CoachColumn } from 'src/apis/column/entities/column.entity';
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

@Entity()
@ObjectType()
export class ColumnComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  contents: string;

  @ManyToOne(() => User)
  @Field()
  user: User;

  @ManyToOne(() => CoachColumn)
  @Field()
  coachColumn: CoachColumn;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
