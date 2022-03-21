import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
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
    const queryRunner = await this.connection.createQueryRunner();
    const queryBuilder = await this.connection.createQueryBuilder();
    await queryRunner.connect();
    try {
      const userblogtemp = await queryRunner.manager.find(Blog, {
        user: currentUser.id,
      });
      const userblogparse = JSON.stringify(userblogtemp);
      const userblog = JSON.parse(userblogparse);
      const likeblog = await Promise.all(
        await userblog.map((ele) => {
          return queryRunner.manager.findOne(BlogLike, {
            user: currentUser.id,
            blog: ele.id,
            islike: true,
          });
        }),
      );
      console.log('+++++++++', likeblog[0]);
      const aaa = likeblog.filter((ele) => {
        return ele;
      });
      console.log(aaa);
      //console.log(likeblog);
      return aaa;
      // const resultlikeblog = likeblog.filter((ele) => ele.length > 0);
      // console.log(resultlikeblog);

      // return resultlikeblog;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
