import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlogLike } from 'src/apis/bloglike/entities/bloglike.entity';
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
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @ManyToOne(() => User, (user) => user.blog)
  @Field(() => User)
  user: User;

  @OneToMany((type) => BlogLike, (bloglike) => bloglike.blog)
  bloglike: BlogLike[];

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
