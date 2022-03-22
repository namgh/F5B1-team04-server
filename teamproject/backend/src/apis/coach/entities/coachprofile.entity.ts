import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @DeleteDateColumn({ nullable: true })
  deletdAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @Column({ nullable: true })
  // @Field(() => Boolean)
  // isHiring: boolean
}
