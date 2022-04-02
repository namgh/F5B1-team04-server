import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlogTag } from 'src/apis/blogtag/entities/blogtag.entity';
//import { CoachTag } from 'src/apis/coachtag/entities/coachtag.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CoachProfile {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  orgName: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  orgType: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  orgEmail: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  department: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  job: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  profileTitle: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  profileContents: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  image: string;

  @Column({ default: 1000 })
  @Field(() => Int)
  answerInitAmount: number;

  @DeleteDateColumn()
  deletdAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.coachProfile)
  user: User;
}
