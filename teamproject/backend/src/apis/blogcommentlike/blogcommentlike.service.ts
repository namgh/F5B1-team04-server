import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  createQueryBuilder,
  getRepository,
  Repository,
} from 'typeorm';
import { BlogComment } from '../blogcomment/entities/blogcomment.entity';
import { User } from '../user/entities/user.entity';
import { BlogCommentLike } from './entities/blogcommentlike.entity';

@Injectable()
export class BlogCommentLikeService {
  constructor(
    @InjectRepository(BlogCommentLike)
    private readonly blogcommentlikerepository: Repository<BlogCommentLike>,

    @InjectRepository(BlogComment)
    private readonly blogcommentrepository: Repository<BlogComment>,

    @InjectRepository(User)
    private readonly userrepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async findBlogcommentlike({ currentUser }) {
    const blogcomment = await getRepository(BlogComment)
      .createQueryBuilder('blogcomment')
      .leftJoinAndSelect('blogcomment.user', 'user')
      .leftJoinAndSelect('blogcomment.blogcommentlike', 'blogcommentlike')
      .leftJoinAndSelect('blogcommentlike.user', 'likeuser')
      .leftJoinAndSelect('blogcomment.blog', 'blog')
      .where('blogcommentlike.islike = :islike', { islike: true })
      .andWhere('likeuser.id = :id', { id: currentUser.id })
      .getMany();

    return blogcomment;
  }

  async like({ blogcommentid, currentUser }) {
    const queryRunner = await this.connection.createQueryRunner();
    const queryBuiler = await this.connection.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const blogcomment = await queryRunner.manager.findOne(
        BlogComment,
        { id: blogcommentid },
        { lock: { mode: 'pessimistic_write' } },
      );

      const user = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });

      const blogcommentlike = await queryRunner.manager.findOne(
        BlogCommentLike,
        {
          user: currentUser.id,
          blogcomment: blogcommentid,
        },
      );

      console.log('++++++', blogcommentid);

      if (!blogcommentlike) {
        const createlike = await this.blogcommentlikerepository.create({
          islike: true,
          user: user,
          blogcomment: blogcomment,
        });

        const like = blogcomment.like + 1;

        const updateblog = await this.blogcommentrepository.create({
          ...blogcomment,
          like,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createlike);

        await queryRunner.commitTransaction();

        return result;
      }

      if (!blogcommentlike.islike) {
        const createlike = await this.blogcommentlikerepository.create({
          ...blogcommentlike,
          islike: true,
        });

        const like = blogcomment.like + 1;

        const updateblog = await this.blogcommentrepository.create({
          ...blogcomment,
          like,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createlike);
        await queryRunner.commitTransaction();
        return result;
      }

      const createlike = await this.blogcommentlikerepository.create({
        ...blogcommentlike,
        islike: false,
      });
      const like = blogcomment.like - 1;

      const updateblog = await this.blogcommentrepository.create({
        ...blogcomment,
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

  async dislike({ blogcommentid, currentUser }) {
    const queryRunner = await this.connection.createQueryRunner();
    const queryBuiler = await this.connection.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const blogcomment = await queryRunner.manager.findOne(
        BlogComment,
        { id: blogcommentid },
        { lock: { mode: 'pessimistic_write' } },
      );

      const user = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });

      const blogcommentdislike = await queryRunner.manager.findOne(
        BlogCommentLike,
        {
          user: currentUser.id,
          blogcomment: blogcommentid,
        },
      );

      if (!blogcommentdislike) {
        const createdislike = await this.blogcommentlikerepository.create({
          isdislike: true,
          user: user,
          blogcomment: blogcomment,
        });

        const dislike = blogcomment.dislike + 1;

        const updateblog = await this.blogcommentrepository.create({
          ...blogcomment,
          dislike,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createdislike);

        await queryRunner.commitTransaction();

        return result;
      }

      if (!blogcommentdislike.isdislike) {
        const createlike = await this.blogcommentlikerepository.create({
          ...blogcommentdislike,
          isdislike: true,
        });

        const like = blogcomment.dislike + 1;

        const updateblog = await this.blogcommentrepository.create({
          ...blogcomment,
          like,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createlike);
        await queryRunner.commitTransaction();
        return result;
      }

      const createdislike = await this.blogcommentlikerepository.create({
        ...blogcommentdislike,
        isdislike: false,
      });
      const dislike = blogcomment.dislike - 1;

      const updateblog = await this.blogcommentrepository.create({
        ...blogcomment,
        dislike,
      });

      await queryRunner.manager.save(updateblog);

      const result = await queryRunner.manager.save(createdislike);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
