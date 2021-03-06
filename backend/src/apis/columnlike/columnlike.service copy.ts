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
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const flag = await queryRunner.manager.findOne(ColumnLike, {
        user: currentUser.id,
        coachColumn: columnId,
      });
      const y = await queryRunner.manager.find(ColumnLike);
      console.log('π y+++', y);
      console.log('π flag++++', flag);

      const user_ = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });
      console.log('πuser', user_);
      const cloumn_ = await queryRunner.manager.findOne(
        CoachColumn,
        { id: columnId },
        // { lock: { mode: 'pessimistic_write' } },
      );
      console.log('πcloumn', cloumn_);
      //flag=null||!false
      // μ’μμ/μ«μ΄μ νλ²λ μν¨ || μ’μμ(μ·¨μ) ν λ€μ μ’μμ || μ«μ΄μ λλ₯Έμ¬λ
      if (flag === undefined || !flag.isLike) {
        console.log('1');

        const like_ = await this.likeRepository.create({
          status: C_LIKE_STATUS_ENUM.COLUMN,
          user: user_,
          coachColumn: cloumn_,
          isLike: true,
        });
        console.log(like_);
        console.log('2');
        const likeRes = await queryRunner.manager.save(like_);
        console.log(likeRes);
        console.log('3');
        const x = await queryRunner.manager.save(CoachColumn, {
          ...cloumn_,
          likecount: ++cloumn_.likecount,
        });
        console.log(x);
        console.log('4');

        await queryRunner.commitTransaction();

        return likeRes;
      } else {
        const id = flag.id;
        const prevLikeStatus = await queryRunner.manager.findOne(ColumnLike, {
          id,
        });
        console.log('π prevLike', prevLikeStatus);
        const toggled = { ...prevLikeStatus, isLike: false };
        console.log('π toggled', toggled);
        const undoLikeRes = await queryRunner.manager.save(ColumnLike, toggled);
        console.log(undoLikeRes);

        console.log('π', cloumn_);
        const col = { ...cloumn_, likecount: --cloumn_.likecount };
        console.log('πcoachcolumn', col);
        const x = await queryRunner.manager.save(CoachColumn, {
          ...cloumn_,
          // likecount: --cloumn_.likecount,
        });
        console.log(x);
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
      console.log('π' + flag);
      //null || !false
      // μ’μμ/μ«μ΄μ νλ²λ μν¨ || μ«μ΄μ(μ·¨μ) ν λ€μ μ«μ΄μ || μ’μμ λλ₯Έμ¬λ
      if (flag === null || !flag.idDislike) {
        if (flag.isLike) {
          this.likeToggle({ columnId, currentUser });
        }
        const dislike_ = this.likeRepository.create({
          status: C_LIKE_STATUS_ENUM.COLUMN,
          user: user_,
          coachColumn: column_,
          idDislike: true,
        });
        await queryRunner.manager.save(CoachColumn, {
          ...column_,
          dislikecount: ++column_.dislikecount,
        });
        const dislikeRes = await queryRunner.manager.save({ dislike_ });
        await queryRunner.commitTransaction();
        return dislikeRes;
      } else {
        //flag.isDislike=true
        const undoDislikeRes = await queryRunner.manager.save({
          ...flag,
          idDislike: false,
        });

        await queryRunner.manager.save(CoachColumn, {
          ...column_,
          dislikecount: --column_.dislikecount,
        });

        await queryRunner.commitTransaction();
        return undoDislikeRes;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
