import { Field, Int, ObjectType } from '@nestjs/graphql';
import { type } from 'os';
import { Blog } from 'src/apis/blog/entities/blog.entity';
import { BlogLike } from 'src/apis/bloglike/entities/bloglike.entity';
import { CoachProfile } from 'src/apis/coach/entities/coachprofile.entity';
import { CoachColumn } from 'src/apis/column/entities/column.entity';
import { ColumnLike } from 'src/apis/columnlike/entities/columnlike.entity';
// import { CoachProfile } from 'src/apis/coach/entities/coachprofile.entity';
import { Stack } from 'src/apis/stack/entities/stack.entity';
import { StackLike } from 'src/apis/stacklike/entities/stacklike.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
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

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  status: USER_TYPE_ENUM;

  @JoinColumn()
  @OneToOne(() => CoachProfile, { nullable: true })
  @Field(() => CoachProfile)
  coachProfile: CoachProfile;

  @DeleteDateColumn()
  deletdAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Blog, (blog) => blog.user)
  blog: Blog[];

  @OneToMany((type) => Stack, (stack) => stack.user)
  stack: Stack[];

  @OneToMany((type) => BlogLike, (bloglike) => bloglike.user)
  bloglike: BlogLike[];

  @OneToMany((type) => StackLike, (stacklike) => stacklike.user)
  stacklike: StackLike[];

  @OneToMany(() => CoachColumn, (coachColumn) => coachColumn.user)
  coachColumn: CoachColumn[];

  @OneToMany(() => ColumnLike, (columnLike) => columnLike.user)
  columnlike: ColumnLike[];
}
