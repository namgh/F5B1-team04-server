import { Field, ObjectType } from '@nestjs/graphql';
import { BlogComment } from 'src/apis/blogcomment/entities/blogcomment.entity';
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
export class BlogCommentLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, (user) => user.bloglike)
  @Field(() => User)
  user: User;

  @ManyToOne(() => BlogComment, (blogcomment) => blogcomment.blogcommentlike)
  @Field(() => BlogComment)
  blogcomment: BlogComment;

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
