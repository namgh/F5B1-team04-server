import { Field, Int, ObjectType } from '@nestjs/graphql';
import { StackLike } from 'src/apis/stacklike/entities/stacklike.entity';
import { StackTag } from 'src/apis/stacktag/entities/stacktag.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Stack {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @ManyToOne(() => User, (user) => user.stack)
  @Field(() => User)
  user: User;

  @OneToMany((type) => StackLike, (stacklike) => stacklike.stack)
  stacklike: StackLike[];

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @Column({ default: 0 })
  @Field(() => Int)
  dislike: number;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletdAt: Date;

  @JoinTable()
  @ManyToMany(() => StackTag, (stacktag) => stacktag.stack)
  @Field(() => [StackTag], { nullable: true })
  stacktag: StackTag[];
}
