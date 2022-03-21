import { Field, ObjectType } from "@nestjs/graphql";
import { Blog } from "src/apis/blog/entities/blog.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class BlogLike {

    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

    @ManyToOne(() => Blog)
    @Field(() => Blog)
    blog: Blog;

    @Column({default: false})
    @Field(() => Boolean)
    islike: Boolean

    @CreateDateColumn()
    createAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletdAt: Date;
}