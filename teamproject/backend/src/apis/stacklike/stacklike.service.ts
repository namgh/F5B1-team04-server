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

  async findBloglike({ currentUser }) {
    const user = await getRepository(Stack)
      .createQueryBuilder('stack')
      .leftJoinAndSelect('stack.user', 'user')
      .leftJoinAndSelect('stack.stacklike', 'stacklike')
      .where('stacklike.islike = :islike', { islike: true })
      .andWhere('user.id = :id', { id: currentUser.id })
      .getMany();

    return user;
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
          stack: stacklike,
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
}
