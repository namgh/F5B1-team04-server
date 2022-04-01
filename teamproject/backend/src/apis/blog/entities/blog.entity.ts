import { Field, Int, ObjectType } from '@nestjs/graphql';
import { type } from 'os';
import { BlogCategoryTag } from 'src/apis/blogcategorytag/entities/blogcategofytag.entity';
import { BlogComment } from 'src/apis/blogcomment/entities/blogcomment.entity';
import { BlogLike } from 'src/apis/bloglike/entities/bloglike.entity';
import { BlogTag } from 'src/apis/blogtag/entities/blogtag.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column({ length: 5000 })
  @Field(() => String)
  contents: string;

  @Column({ length: 2000 })
  @Field(() => String)
  url: string;

  @ManyToOne(() => User, (user) => user.blog)
  @Field(() => User)
  user: User;

  @OneToMany((type) => BlogLike, (bloglike) => bloglike.blog)
  bloglike: BlogLike[];

  @OneToMany((type) => BlogComment, (blogcomment) => blogcomment.blog)
  blogcomment: BlogComment[];

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @Column({ default: 0 })
  @Field(() => Int)
  dislike: number;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedat: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletdAt: Date;

  @JoinTable()
  @ManyToMany(() => BlogTag, (blogtag) => blogtag.blog, { nullable: true })
  @Field(() => [BlogTag], { nullable: true })
  blogtag: BlogTag[];

  @JoinTable()
  @ManyToMany(
    () => BlogCategoryTag,
    (blogcategofytag) => blogcategofytag.blog,
    { nullable: true },
  )
  @Field(() => [BlogCategoryTag], { nullable: true })
  blogcategorytag: BlogCategoryTag[];
}
