import { Field, Int, ObjectType } from '@nestjs/graphql';
import { StackLike } from 'src/apis/stacklike/entities/stacklike.entity';
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

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletdAt: Date;
}
