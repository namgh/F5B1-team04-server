import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  createQueryBuilder,
  getRepository,
  Repository,
} from 'typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';
import { BlogLike } from './entities/bloglike.entity';

@Injectable()
export class BlogLikeService {
  constructor(
    @InjectRepository(BlogLike)
    private readonly bloglikerepository: Repository<BlogLike>,

    @InjectRepository(Blog)
    private readonly blogrepository: Repository<Blog>,

    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
    private readonly connection: Connection,
  ) {}

  async findBloglike({ currentUser }) {
    const user = await getRepository(Blog)
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .leftJoinAndSelect('blog.bloglike', 'bloglike')
      .where('bloglike.islike = :islike', { islike: true })
      .andWhere('user.id = :id', { id: currentUser.id })
      .getMany();

    return user;
  }

  async like({ blogid, currentUser }) {
    const queryRunner = await this.connection.createQueryRunner();
    const queryBuiler = await this.connection.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const blog = await queryRunner.manager.findOne(
        Blog,
        { id: blogid },
        { lock: { mode: 'pessimistic_write' } },
      );

      const user = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });

      const bloglike = await queryRunner.manager.findOne(BlogLike, {
        user: currentUser.id,
        blog: blogid,
      });

      console.log('++++++', bloglike);

      if (!bloglike) {
        const createlike = await this.bloglikerepository.create({
          islike: true,
          user: user,
          blog: blog,
        });

        const like = blog.like + 1;

        const updateblog = await this.blogrepository.create({
          ...blog,
          like,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createlike);

        await queryRunner.commitTransaction();

        return result;
      }

      if (!bloglike.islike) {
        const createlike = await this.bloglikerepository.create({
          ...bloglike,
          islike: true,
        });

        const like = blog.like + 1;

        const updateblog = await this.blogrepository.create({
          ...blog,
          like,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createlike);
        await queryRunner.commitTransaction();
        return result;
      }

      const createlike = await this.bloglikerepository.create({
        ...bloglike,
        islike: false,
      });
      const like = blog.like - 1;

      const updateblog = await this.blogrepository.create({
        ...blog,
        like,
      });

      await queryRunner.manager.save(updateblog);

      const result = await queryRunner.manager.save(createlike);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
