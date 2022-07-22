import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Blog } from 'src/apis/blog/entities/blog.entity';
import { Stack } from 'src/apis/stack/entities/stack.entity';
import { StackCommentLike } from 'src/apis/stackcommentlike/entities/stackcommentlike.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class StackComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  contents: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Stack)
  @Field(() => Stack)
  stack: Stack;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletdAt: Date;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @Column({ default: 0 })
  @Field(() => Int)
  dislike: number;

  @OneToMany(
    (type) => StackCommentLike,
    (stackcommentlike) => stackcommentlike.stackcomment,
  )
  stackcommentlike: StackCommentLike[];
}
