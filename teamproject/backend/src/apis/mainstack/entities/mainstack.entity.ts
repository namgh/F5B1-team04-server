import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class MainStack {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: 0 })
  @Field(() => Int)
  Python: number;

  @Column({ default: 0 })
  @Field(() => Int)
  C: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Java: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Cpp: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Cshop: number;

  @Column({ default: 0 })
  @Field(() => Int)
  JavaScript: number;

  @Column({ default: 0 })
  @Field(() => Int)
  PHP: number;

  @Column({ default: 0 })
  @Field(() => Int)
  SQL: number;

  @Column({ default: 0 })
  @Field(() => Int)
  R: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Go: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Swift: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Ruby: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Git: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Objective_C: number;

  @Column({ default: 0 })
  @Field(() => Int)
  CSS: number;

  @Column({ default: 0 })
  @Field(() => Int)
  HTML: number;

  @Column({ default: 0 })
  @Field(() => Int)
  React_js: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Vue_js: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Node_js: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Express: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Spring: number;

  @Column({ default: 0 })
  @Field(() => Int)
  etc: number;

  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  user: User;
}
