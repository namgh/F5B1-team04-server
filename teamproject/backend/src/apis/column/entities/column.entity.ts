import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ColumnLike } from 'src/apis/columnlike/entities/columnlike.entity';
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
export class CoachColumn {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column({ default: 0 })
  @Field(() => Int)
  hits: number;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  @Field(() => Int)
  likecount: number;

  @OneToMany(() => ColumnLike, (columnLike) => columnLike.user)
  columnLike: ColumnLike[];
}
