import { Field, ObjectType } from '@nestjs/graphql';
import { Blog } from 'src/apis/blog/entities/blog.entity';
import { Stack } from 'src/apis/stack/entities/stack.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class StackTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  tag: string;

  @DeleteDateColumn()
  deletdAt: Date;

  @ManyToMany(() => Stack, (stack) => stack.stacktag)
  @Field(() => [Stack])
  stack: Stack[];
}
