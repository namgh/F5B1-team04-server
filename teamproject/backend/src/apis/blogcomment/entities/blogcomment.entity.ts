import { Field, ObjectType } from "@nestjs/graphql";
import { Blog } from "src/apis/blog/entities/blog.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity()
@ObjectType()
export class BlogComment{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    contents: string;

    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

    @ManyToOne(() => Blog)
    @Field(() => Blog)
    blog: Blog;
    
    @CreateDateColumn()
    createAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletdAt: Date;
}