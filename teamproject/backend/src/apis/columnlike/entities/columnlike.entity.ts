import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoachColumn } from 'src/apis/column/entities/column.entity';
import { ColumnComment } from 'src/apis/columncomment/entities/columncomment.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum C_LIKE_STATUS_ENUM {
  COLUMN = 'COLUMN',
  COMMENT = 'COMMENT',
}

registerEnumType(C_LIKE_STATUS_ENUM, {
  name: 'C_LIKE_STATUS',
});

@Entity()
@ObjectType()
export class ColumnLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @Column({ type: 'enum', enum: C_LIKE_STATUS_ENUM })
  @Field(() => C_LIKE_STATUS_ENUM)
  status: C_LIKE_STATUS_ENUM;

  @ManyToOne(() => CoachColumn, { nullable: true })
  @Field(() => CoachColumn)
  coachColumn: CoachColumn;

  @ManyToOne(() => ColumnComment, { nullable: true })
  @Field(() => ColumnComment)
  columnComment: ColumnComment;

  @Column({ default: false })
  @Field(() => Boolean)
  isLike: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  idDislike: boolean;
}
