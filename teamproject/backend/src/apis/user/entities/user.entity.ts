import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Blog } from 'src/apis/blog/entities/blog.entity';
import { BlogLike } from 'src/apis/bloglike/entities/bloglike.entity';
import { CoachProfile } from 'src/apis/coach/entities/coachprofile.entity';
import { CoachColumn } from 'src/apis/column/entities/column.entity';
import { ColumnLike } from 'src/apis/columnlike/entities/columnlike.entity';
import { MainStack } from 'src/apis/mainstack/entities/mainstack.entity';
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

export enum Role {
  USER = 'USER',
  COACH = 'COACH',
  ADMIN = 'ADMIN',
}
registerEnumType(Role, { name: 'Role' });
@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  phonenumber?: string;

  @Column()
  @Field(() => String)
  nickname: string;

  @Column({ nullable: true })
  @Field(() => String)
  codeInterest: string;

  @Column({ nullable: true })
  @Field(() => String)
  coachInterest: string;

  @Column({ default: 0 })
  @Field(() => Int)
  score: number;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

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

  @JoinColumn({})
  @OneToOne(() => MainStack)
  @Field(() => MainStack)
  mainstack: MainStack;

  @OneToMany(() => CoachColumn, (coachColumn) => coachColumn.user)
  coachColumn: CoachColumn[];

  @OneToMany(() => ColumnLike, (columnLike) => columnLike.user)
  columnlike: ColumnLike[];

  @OneToOne(() => MainStack)
  @Field(() => MainStack)
  user: MainStack;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  @Field(() => Role)
  role: Role;
}
