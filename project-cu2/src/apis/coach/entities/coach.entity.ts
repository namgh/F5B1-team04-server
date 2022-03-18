import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Coach {
  // @PrimaryColumn()
  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  id: User;

  @Column()
  @Field(() => String)
  orgName: string;

  @Column()
  @Field(() => String)
  orgType: string;

  @Column()
  @Field(() => String)
  orgEmail: string;

  @Column()
  @Field(() => String)
  department: string;

  @Column()
  @Field(() => String)
  job: string;

  @Column()
  @Field(() => Boolean)
  isHiring: boolean;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => String)
  image: string;

  // tag: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
