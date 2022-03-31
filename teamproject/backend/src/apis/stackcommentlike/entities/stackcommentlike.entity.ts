import { Field, ObjectType } from '@nestjs/graphql';
import { BlogComment } from 'src/apis/blogcomment/entities/blogcomment.entity';
import { StackComment } from 'src/apis/stackcomment/entities/stackcomment.entity';
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
export class StackCommentLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, (user) => user.bloglike)
  @Field(() => User)
  user: User;

  @ManyToOne(
    () => StackComment,
    (stackcomment) => stackcomment.stackcommentlike,
  )
  @Field(() => StackComment)
  stackcomment: StackComment;

  @Column({ default: false })
  @Field(() => Boolean)
  islike: Boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  dislike: Boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletdAt: Date;
}
