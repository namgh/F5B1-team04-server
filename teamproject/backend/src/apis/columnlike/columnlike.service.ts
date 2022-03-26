import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Column, Connection, Repository } from 'typeorm';
import { CoachColumn } from '../column/entities/column.entity';
import { User } from '../user/entities/user.entity';
import { ColumnLike, C_LIKE_STATUS_ENUM } from './entities/columnlike.entity';

@Injectable()
export class ColumnlikeService {
  constructor(
    @InjectRepository(ColumnLike)
    private readonly likeRepository: Repository<ColumnLike>,

    @InjectRepository(CoachColumn)
    private readonly columnRepository: Repository<CoachColumn>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async likeToggle({ columnId, currentUser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const flag = await queryRunner.manager.findOne(ColumnLike, {
        user: currentUser.id,
        coachColumn: columnId,
      });
      const user_ = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });
      const column_ = await queryRunner.manager.findOne(CoachColumn, {
        id: columnId,
      });

      if (flag === undefined) {
        /**첫 좋아요(/싫어요)
         * 1. 컨텐츠(컬럼) 좋아요 수++
         * 2. 좋아요 DB true
         */
        const updColumn = await queryRunner.manager.save(CoachColumn, {
          ...column_,
          likecount: ++column_.likecount,
        });
        const like_ = this.likeRepository.create({
          status: C_LIKE_STATUS_ENUM.COLUMN,
          user: user_,
          coachColumn: updColumn,
          isLike: true,
        });
        const likeRes = await queryRunner.manager.save(like_);
        await queryRunner.commitTransaction();
        return likeRes;
      } else if (!flag.isLike) {
        if (flag.idDislike) {
          /** 싫어요 눌린 상태
           * 1. 컨텐츠(컬럼) 싫어요 수 --
           * 2. 컨텐츠(컬럼) 좋아요 수 ++
           * 3. 싫어요 DB false
           * 4. 좋아요 DB true
           */
          const updColumn = await queryRunner.manager.save(CoachColumn, {
            ...column_,
            likecount: ++column_.likecount,
            dislikecount: --column_.dislikecount,
          });
          const like_ = this.likeRepository.create({
            ...flag,
            user: user_,
            coachColumn: updColumn,
            idDislike: false,
            isLike: true,
          });
          const likeRes = await queryRunner.manager.save(like_);
          await queryRunner.commitTransaction();
          return likeRes;
        } else {
          /** 좋아요 취소 후 좋아요
           * 1. 컨텐츠(컬럼) 좋아요 수 ++
           * 2. 좋아요 DB true
           */
          const updColumn = await queryRunner.manager.save(CoachColumn, {
            ...column_,
            likecount: ++column_.likecount,
          });
          const like_ = this.likeRepository.create({
            ...flag,
            user: user_,
            coachColumn: updColumn,
            isLike: true,
          });
          const likeRes = await queryRunner.manager.save(like_);
          await queryRunner.commitTransaction();
          return likeRes;
        }
      } else {
        /** 좋아요 눌린 상태
         * 1. 컨텐츠(컬럼) 좋아요 --
         * 1. 좋아요 DB false
         */
        const updColumn = await queryRunner.manager.save(CoachColumn, {
          ...column_,
          likecount: --column_.likecount,
        });
        const like_ = this.likeRepository.create({
          ...flag,
          user: user_,
          coachColumn: updColumn,
          isLike: false,
        });
        const undoLikeRes = await queryRunner.manager.save(like_);
        await queryRunner.commitTransaction();
        return undoLikeRes;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async dislikeToggle({ columnId, currentUser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const flag = await queryRunner.manager.findOne(ColumnLike, {
        user: currentUser.id,
        coachColumn: columnId,
      });
      const user_ = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });
      const cloumn_ = await queryRunner.manager.findOne(CoachColumn, {
        id: columnId,
      });

      if (flag === undefined) {
        //
        await queryRunner.manager.save(CoachColumn, {
          ...cloumn_,
          dislikecount: ++cloumn_.dislikecount,
        });
        const dislike_ = this.likeRepository.create({
          status: C_LIKE_STATUS_ENUM.COLUMN,
          user: user_,
          coachColumn: cloumn_,
          idDislike: true,
        });
        const dislikeRes = await queryRunner.manager.save(dislike_);
        await queryRunner.commitTransaction();
        return dislikeRes;
        //
      } else if (!flag.idDislike) {
        //
        if (flag.isLike) {
          await queryRunner.manager.save(CoachColumn, {
            ...cloumn_,
            likecount: --cloumn_.likecount,
            dislikecount: ++cloumn_.dislikecount,
          });
          const dislike_ = this.likeRepository.create({
            ...flag,
            user: user_,
            coachColumn: cloumn_,
            isLike: false,
            idDislike: true,
          });
          const dislikeRes = await queryRunner.manager.save(dislike_);
          await queryRunner.commitTransaction();
          return dislikeRes;
          //
        } else {
          //
          await queryRunner.manager.save(CoachColumn, {
            ...cloumn_,
            dislikecount: ++cloumn_.dislikecount,
          });
          const dislike_ = this.likeRepository.create({
            ...flag,
            user: user_,
            coachColumn: cloumn_,
            idDislike: true,
          });

          const dislikeRes = await queryRunner.manager.save(dislike_);
          await queryRunner.commitTransaction();
          return dislikeRes;
        }
      } else {
        //
        await queryRunner.manager.save(CoachColumn, {
          ...cloumn_,
          dislikecount: --cloumn_.dislikecount,
        });

        const dislike_ = this.likeRepository.create({
          ...flag,
          user: user_,
          coachColumn: cloumn_,
          idDislike: false,
        });

        const dislikeRes = await queryRunner.manager.save(dislike_);
        await queryRunner.commitTransaction();
        return dislikeRes;
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
