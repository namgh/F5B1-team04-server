import { Field, ObjectType } from '@nestjs/graphql';
import { createSecureServer } from 'http2';
import { User } from 'src/apis/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User)
  @Field(() => User)
  fromUserId: User;

  @ManyToOne(() => User)
  @Field(() => User)
  toUserId: User;

  //설정값? relate?
}
