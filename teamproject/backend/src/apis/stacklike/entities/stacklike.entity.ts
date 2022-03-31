import { Field, ObjectType } from '@nestjs/graphql';
import { Blog } from 'src/apis/blog/entities/blog.entity';
import { Stack } from 'src/apis/stack/entities/stack.entity';
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
export class StackLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, (user) => user.bloglike)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Stack, (stack) => stack.stacklike)
  @Field(() => Stack)
  stack: Stack;

  @Column({ default: false })
  @Field(() => Boolean)
  islike: Boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletdAt: Date;
}
