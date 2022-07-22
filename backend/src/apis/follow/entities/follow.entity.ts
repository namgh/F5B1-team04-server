import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, (user) => user.following)
  @Field(() => User, { nullable: true })
  following: User;

  @ManyToOne(() => User, (user) => user.follower)
  @Field(() => User, { nullable: true })
  follower: User;

  @DeleteDateColumn()
  @Field(() => Date)
  deletdAt: Date;
}
