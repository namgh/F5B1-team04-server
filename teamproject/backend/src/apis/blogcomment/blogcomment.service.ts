import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';
import { BlogComment } from './entities/blogcomment.entity';

@Injectable()
export class BlogCommentService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogrepository: Repository<Blog>,

    @InjectRepository(BlogComment)
    private readonly blogCommentrepository: Repository<BlogComment>,

    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
  ) {}

  async fetchBlogCommentorderbylike({ blogid }) {
    return await getRepository(BlogComment)
      .createQueryBuilder('blogcomment')
      .leftJoinAndSelect('blogcomment.blog', 'blog')
      .leftJoinAndSelect('blogcomment.user', 'user')
      .where('blog.id = :id', { id: blogid })
      .orderBy('blogcomment.like', 'DESC')
      .getMany();
  }

  async fetchBlogCommentorderbycreate({ blogid }) {
    return await getRepository(BlogComment)
      .createQueryBuilder('blogcomment')
      .leftJoinAndSelect('blogcomment.blog', 'blog')
      .leftJoinAndSelect('blogcomment.user', 'user')
      .where('blog.id = :id', { id: blogid })
      .orderBy('blogcomment.createAt', 'DESC')
      .getMany();
  }

  async create({ blogid, contents, currentUser }) {
    const user = await this.userrepository.findOne({
      email: currentUser.email,
    });
    const blog = await this.blogrepository.findOne({
      id: blogid,
    });
    return await this.blogCommentrepository.save({
      contents,
      user,
      blog,
    });
  }

  async update({ blogcommentid, blogid, contents, currentUser }) {
    const blogcomment = await this.blogCommentrepository.findOne({
      id: blogcommentid,
    });
    return await this.blogCommentrepository.save({
      ...blogcomment,
      contents,
    });
  }

  async delete({ blogcommentid, currentUser }) {
    const blogcomment = await getRepository(BlogComment)
      .createQueryBuilder('blogcomment')
      .leftJoinAndSelect('blogcomment.user', 'user')
      .where('blogcomment.id = :id', { id: blogcommentid })
      .andWhere('user.id = :id', { id: currentUser.id })
      .getMany();

    if (blogcomment) {
      const result = await this.blogCommentrepository.softDelete({
        id: blogcommentid,
      });
      return result.affected ? true : false;
    }
    return null;
  }

  async findAll({ blogid }) {
    return await getRepository(BlogComment)
      .createQueryBuilder('blogcomment')
      .leftJoinAndSelect('blogcomment.blog', 'blog')
      .leftJoinAndSelect('blogcomment.user', 'user')
      .where('blog.id = :id', { id: blogid })
      .orderBy('blogcomment.id', 'DESC')
      .getMany();
  }
}
