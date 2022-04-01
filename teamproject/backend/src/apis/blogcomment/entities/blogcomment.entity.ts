import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Blog } from 'src/apis/blog/entities/blog.entity';
import { BlogCommentLike } from 'src/apis/blogcommentlike/entities/blogcommentlike.entity';
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
export class BlogComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  contents: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @OneToMany(
    (type) => BlogCommentLike,
    (blogCommentLike) => blogCommentLike.blogcomment,
  )
  blogcommentlike: BlogCommentLike[];

  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  @Field(() => Blog)
  blog: Blog;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @Column({ default: 0 })
  @Field(() => Int)
  dislike: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletdAt: Date;
}
