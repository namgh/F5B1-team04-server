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
export class BlogTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  tag: string;

  @DeleteDateColumn()
  deletdAt: Date;

  @ManyToMany(() => Blog, (blog) => blog.blogtag)
  @Field(() => [Blog])
  blog: Blog[];
}
