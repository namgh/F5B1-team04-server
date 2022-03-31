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

  @Column()
  @Field(() => String)
  orgName: string;

  //todo : coachingus category join
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
  @Field(() => String)
  profileTitle: string;

  @Column()
  @Field(() => String)
  profileContents: string;

  @Column()
  @Field(() => String)
  image: string;

  @Column({ default: 1000 })
  @Field(() => Int, { nullable: true })
  answerInitAmount: number;

  @DeleteDateColumn({ nullable: true })
  deletdAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.coachProfile)
  user: User;
}
