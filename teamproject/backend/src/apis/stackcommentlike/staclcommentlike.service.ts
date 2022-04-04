import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  createQueryBuilder,
  getRepository,
  Repository,
} from 'typeorm';
import { BlogComment } from '../blogcomment/entities/blogcomment.entity';
import { StackComment } from '../stackcomment/entities/stackcomment.entity';
import { User } from '../user/entities/user.entity';
import { StackCommentLike } from './entities/stackcommentlike.entity';

@Injectable()
export class StackCommentLikeService {
  constructor(
    @InjectRepository(StackCommentLike)
    private readonly stackcommentlikerepository: Repository<StackCommentLike>,

    @InjectRepository(StackComment)
    private readonly stackcommentrepository: Repository<StackComment>,

    @InjectRepository(User)
    private readonly userrepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async findStackcommentlike({ currentUser }) {
    const stackcomment = await getRepository(StackComment)
      .createQueryBuilder('stackcomment')
      .leftJoinAndSelect('stackcomment.user', 'user')
      .leftJoinAndSelect('stackcomment.stackcommentlike', 'stackcommentlike')
      .leftJoinAndSelect('stackcommentlike.user', 'stackcommentlikeuser')
      .leftJoinAndSelect('stackcomment.stack','stack')
      .leftJoinAndSelect('stack.user','stackuser')
      .where('stackcommentlike.islike = :islike', { islike: true })
      .andWhere('stackcommentlikeuser.id = :id', { id: currentUser.id })
      .getMany();

    return stackcomment;
  }

  async like({ stackcommentid, currentUser }) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const stackcomment = await queryRunner.manager.findOne(
        StackComment,
        { id: stackcommentid },
        { lock: { mode: 'pessimistic_write' } },
      );

      const user = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });

      const stackcommentlike = await queryRunner.manager.findOne(
        StackCommentLike,
        {
          user: currentUser.id,
          stackcomment: stackcommentid,
        },
      );

      if (!stackcommentlike) {
        const createlike = await this.stackcommentlikerepository.create({
          islike: true,
          user: user,
          stackcomment: stackcomment,
        });

        const like = stackcomment.like + 1;

        const updateblog = await this.stackcommentrepository.create({
          ...stackcomment,
          like,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createlike);

        await queryRunner.commitTransaction();

        return result;
      }

      if (!stackcommentlike.islike) {
        const createlike = await this.stackcommentlikerepository.create({
          ...stackcommentlike,
          islike: true,
        });

        const like = stackcomment.like + 1;

        const updatestack = await this.stackcommentrepository.create({
          ...stackcomment,
          like,
        });

        await queryRunner.manager.save(updatestack);

        const result = await queryRunner.manager.save(createlike);
        await queryRunner.commitTransaction();
        return result;
      }

      const createlike = await this.stackcommentlikerepository.create({
        ...stackcommentlike,
        islike: false,
      });
      const like = stackcomment.like - 1;

      const updateblog = await this.stackcommentrepository.create({
        ...stackcomment,
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

  async dislike({ stackcommentid, currentUser }) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const stackcomment = await queryRunner.manager.findOne(
        StackComment,
        { id: stackcommentid },
        { lock: { mode: 'pessimistic_write' } },
      );

      const user = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });

      const blogcommentlike = await queryRunner.manager.findOne(
        StackCommentLike,
        {
          user: currentUser.id,
          stackcomment: stackcommentid,
        },
      );

      if (!blogcommentlike) {
        const createlike = await this.stackcommentlikerepository.create({
          dislike: true,
          user: user,
          stackcomment: stackcomment,
        });

        const dislike = stackcomment.dislike + 1;

        const updateblog = await this.stackcommentrepository.create({
          ...stackcomment,
          dislike,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createlike);

        await queryRunner.commitTransaction();

        return result;
      }

      if (!blogcommentlike.dislike) {
        const createlike = await this.stackcommentlikerepository.create({
          ...blogcommentlike,
          dislike: true,
        });

        const dislike = stackcomment.dislike + 1;

        const updateblog = await this.stackcommentrepository.create({
          ...stackcomment,
          dislike,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createlike);
        await queryRunner.commitTransaction();
        return result;
      }

      const createlike = await this.stackcommentlikerepository.create({
        ...blogcommentlike,
        dislike: false,
      });
      const dislike = stackcomment.dislike - 1;

      const updateblog = await this.stackcommentrepository.create({
        ...stackcomment,
        dislike,
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
