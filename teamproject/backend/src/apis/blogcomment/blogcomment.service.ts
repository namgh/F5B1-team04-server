import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blog } from "../blog/entities/blog.entity";
import { User } from "../user/entities/user.entity";
import { BlogComment } from "./entities/blogcomment.entity";



@Injectable()
export class BlogCommentService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogrepository: Repository<Blog>,

        @InjectRepository(BlogComment)
        private readonly blogCommentrepository: Repository<BlogComment>,
        
        @InjectRepository(User)
        private readonly userrepository: Repository<User>,

    ){}


    async create({ blogid, contents, currentUser }) {
        const user = await this.userrepository.findOne({
          email: currentUser.email,
        });
        const blog = await this.blogrepository.findOne({
            id:blogid
        })
        console.log("================",blog)
        return await this.blogCommentrepository.save({
          contents,
          user,
          blog,
        });
      }

      async update({blogcommentid,blogid,contents,currentUser}){
        const blogcomment = await this.blogCommentrepository.findOne({ id: blogcommentid });
        return await this.blogCommentrepository.save({
            ...blogcomment,
            contents,
        })
      }

      async delete({blogcommentid}){
            const result = await this.blogCommentrepository.softDelete({
              id: blogcommentid,
            });
            return result.affected ? true : false;

      }

      async findAll({blogid}){
        return await this.blogCommentrepository.find({
            where: {blog:blogid}
        })
      }
}