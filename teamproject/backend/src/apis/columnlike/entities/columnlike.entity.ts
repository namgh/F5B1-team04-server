import { Field, ObjectType } from '@nestjs/graphql';
import { CoachColumn } from 'src/apis/column/entities/column.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ColumnLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => CoachColumn)
  @Field(() => CoachColumn)
  coachColumn: CoachColumn;

  @Column({ default: false })
  @Field(() => Boolean)
  isLike: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  idDislike: boolean;
}
