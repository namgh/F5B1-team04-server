import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { jwtAccessStrategy } from "src/common/auth/jwt-access.strategy";
import { AuthModule } from "../auth/auth.module";
import { Blog } from "../blog/entities/blog.entity";
import { User } from "../user/entities/user.entity";
import { BlogCommentResolver } from "./blogcomment.resolver";
import { BlogCommentService } from "./blogcomment.service";
import { BlogComment } from "./entities/blogcomment.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Blog, User,BlogComment])],
  
    providers: [BlogCommentService, BlogCommentResolver, jwtAccessStrategy, AuthModule],
  })
  export class BlogCommentModule {}
  