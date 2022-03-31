import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  createQueryBuilder,
  getRepository,
  Repository,
} from 'typeorm';
import { Stack } from '../stack/entities/stack.entity';
import { User } from '../user/entities/user.entity';
import { StackLike } from './entities/stacklike.entity';

@Injectable()
export class StackLikeService {
  constructor(
    @InjectRepository(StackLike)
    private readonly stacklikerepository: Repository<StackLike>,

    @InjectRepository(Stack)
    private readonly stackrepository: Repository<Stack>,

    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
    private readonly connection: Connection,
  ) {}

  async findstacklike({ currentUser }) {
    const stack = await getRepository(Stack)
      .createQueryBuilder('stack')
      .leftJoinAndSelect('stack.user', 'stackuser')
      .leftJoinAndSelect('stack.stacklike', 'stacklike')
      .leftJoinAndSelect('stacklike.user', 'user')
      .where('stacklike.islike = :islike', { islike: true })
      .andWhere('user.id = :id', { id: currentUser.id })
      .getMany();

    // const aaa = await getRepository(Stack)
    //   .createQueryBuilder('stack')
    //   .leftJoinAndSelect('stack.user', 'user')
    //   .leftJoinAndSelect('stack.stacklike', 'stacklike')
    //   .where('stacklike.islike = :islike', { islike: true })
    //   .andWhere('user.id = :id', { id: currentUser.id })
    //   .getMany();

    // console.log(aaa);
    return stack;
  }

  async like({ stackid, currentUser }) {
    const queryRunner = await this.connection.createQueryRunner();
    const queryBuiler = await this.connection.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const stack = await queryRunner.manager.findOne(
        Stack,
        { id: stackid },
        { lock: { mode: 'pessimistic_write' } },
      );

      const user = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });

      const stacklike = await queryRunner.manager.findOne(StackLike, {
        user: currentUser.id,
        stack: stackid,
      });

      console.log('++++++', stacklike);

      if (!stacklike) {
        const createlike = await this.stacklikerepository.create({
          islike: true,
          user: user,
          stack: stack,
        });

        const like = stack.like + 1;

        const updatestack = await this.stackrepository.create({
          ...stack,
          like,
        });

        await queryRunner.manager.save(updatestack);

        const result = await queryRunner.manager.save(createlike);

        await queryRunner.commitTransaction();

        return result;
      }

      if (!stacklike.islike) {
        const createlike = await this.stacklikerepository.create({
          ...stacklike,
          islike: true,
        });

        const like = stack.like + 1;

        const updateblog = await this.stackrepository.create({
          ...stack,
          like,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createlike);
        await queryRunner.commitTransaction();
        return result;
      }

      const createlike = await this.stacklikerepository.create({
        ...stacklike,
        islike: false,
      });
      const like = stack.like - 1;

      const updateblog = await this.stackrepository.create({
        ...stack,
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

  async dislike({ stackid, currentUser }) {
    const queryRunner = await this.connection.createQueryRunner();
    const queryBuiler = await this.connection.createQueryBuilder();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const stack = await queryRunner.manager.findOne(
        Stack,
        { id: stackid },
        { lock: { mode: 'pessimistic_write' } },
      );

      const user = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });

      const stacklike = await queryRunner.manager.findOne(StackLike, {
        user: currentUser.id,
        stack: stackid,
      });

      if (!stacklike) {
        const createlike = await this.stacklikerepository.create({
          islike: true,
          user: user,
          stack: stack,
        });

        const dislike = stack.dislike + 1;

        const updatestack = await this.stackrepository.create({
          ...stack,
          dislike,
        });

        await queryRunner.manager.save(updatestack);

        const result = await queryRunner.manager.save(createlike);

        await queryRunner.commitTransaction();

        return result;
      }

      if (!stacklike.islike) {
        const createlike = await this.stacklikerepository.create({
          ...stacklike,
          islike: true,
        });

        const dislike = stack.dislike + 1;

        const updateblog = await this.stackrepository.create({
          ...stack,
          dislike,
        });

        await queryRunner.manager.save(updateblog);

        const result = await queryRunner.manager.save(createlike);
        await queryRunner.commitTransaction();
        return result;
      }

      const createlike = await this.stacklikerepository.create({
        ...stacklike,
        islike: false,
      });
      const dislike = stack.dislike - 1;

      const updateblog = await this.stackrepository.create({
        ...stack,
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
