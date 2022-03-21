import { Field, ObjectType } from '@nestjs/graphql';
import { Blog } from 'src/apis/blog/entities/blog.entity';
import { BlogLike } from 'src/apis/bloglike/entities/bloglike.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum USER_TYPE_ENUM {
  USER = 'USER',
  COACH = 'COACH',
  ADMIN = 'ADMIN',
}

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  @Field(() => String)
  nickname: string;

  @Column({ nullable: true })
  @Field(() => String)
  codeInterest: string;

  @Column({ nullable: true })
  @Field(() => String)
  coachInterest: string;

  score: number;

  point: number;

  status: USER_TYPE_ENUM;

  @DeleteDateColumn()
  deletdAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Blog, (blog) => blog.user)
  blog: Blog[];

  @OneToMany((type) => BlogLike, (bloglike) => bloglike.user)
  bloglike: BlogLike[];
}
