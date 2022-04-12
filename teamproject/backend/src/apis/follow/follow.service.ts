import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { Connection, getRepository, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followrepository: Repository<Follow>,

    @InjectRepository(User)
    private readonly userrepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async createfollow({ currentUser, followUserId }) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const followingUser = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );
      const followerUser = await queryRunner.manager.findOne(
        User,
        {
          id: followUserId,
        },
        { lock: { mode: 'pessimistic_write' } },
      );

      const alreadycheck = await queryRunner.manager.findOne(Follow, {
        following: followingUser,
        follower: followerUser,
      });
      if (alreadycheck) throw new error('이미팔로우하셨습니다');

      const following = await queryRunner.manager.save(User, {
        ...followingUser,
        followingnumber: followingUser.followingnumber + 1,
      });

      const follower = await queryRunner.manager.save(User, {
        ...followerUser,
        followernumber: followerUser.followernumber + 1,
      });

      const result = await queryRunner.manager.save(Follow, {
        follower,
        following,
      });
      await queryRunner.commitTransaction();

      return result;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('이미 팔로우하셨습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  async fetchFollower({ userId }) {
    return await getRepository(Follow)
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'follower')
      .leftJoinAndSelect('follow.following', 'following')
      .where('follower.id = :id', { id: userId })
      .getMany();
  }

  async fetchFollowing({ userId }) {
    return await getRepository(Follow)
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'follower')
      .leftJoinAndSelect('follow.following', 'following')
      .where('following.id = :id', { id: userId })
      .getMany();
  }

  async fetchmyFollower({ currentUser }) {
    return await getRepository(Follow)
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'follower')
      .leftJoinAndSelect('follow.following', 'following')
      .where('follower.id = :id', { id: currentUser.id })
      .getMany();
  }

  async fetchmyFollowing({ currentUser }) {
    return await getRepository(Follow)
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'follower')
      .leftJoinAndSelect('follow.following', 'following')
      .where('following.id = :id', { id: currentUser.id })
      .getMany();
  }
}
