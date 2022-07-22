import { Field, ObjectType } from '@nestjs/graphql';
import { Blog } from 'src/apis/blog/entities/blog.entity';
import { CoachProfile } from 'src/apis/coach/entities/coachprofile.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CoachTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  tag: string;

  @DeleteDateColumn()
  deletdAt: Date;

  @ManyToMany(() => User, (user) => user.coachtag)
  @Field(() => [User])
  user: User[];
}
