import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Answer } from '../answer/entities/answer.entity';
import { User } from '../user/entities/user.entity';
import { AnswerLike } from './entities/answerlike.entity';

@Injectable()
export class AnswerlikeService {
  constructor(
    @InjectRepository(AnswerLike)
    private readonly answerlikeRepository: Repository<AnswerLike>,

    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async likeToggle({ answerId, currentUser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const flag = await queryRunner.manager.findOne(
        AnswerLike,
        { user: { id: currentUser.id }, answer: { id: answerId } },
        { relations: ['user', 'answer'] },
      );
      console.log('💛flag', flag);

      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { relations: ['coachProfile'] },
      );
      const answer = await queryRunner.manager.findOne(
        Answer,
        { id: answerId },
        { relations: ['question'] },
      );

      if (flag === undefined) {
        const updAnswer = await queryRunner.manager.save(Answer, {
          ...answer,
          likecount: ++answer.likecount,
        });
        const like = this.answerlikeRepository.create({
          user,
          answer: updAnswer,
          isLike: true,
        });
        const likeRes = await queryRunner.manager.save(like);
        console.log('💛likeRes', likeRes);
        await queryRunner.commitTransaction();
        return likeRes;
      } else if (!flag.isLike) {
        if (flag.idDislike) {
          const updAnswer = await queryRunner.manager.save(Answer, {
            ...answer,
            likecount: ++answer.likecount,
            dislikecount: --answer.likecount,
          });
          const likeRes = await queryRunner.manager.save(AnswerLike, {
            ...flag,
            answer: updAnswer,
            isLike: true,
            idDislike: false,
          });
          console.log('💛likeRes', likeRes);
          await queryRunner.commitTransaction();
          return likeRes;
        } else {
          const updAnswer = await queryRunner.manager.save(Answer, {
            ...answer,
            likecount: ++answer.likecount,
          });
          const likeRes = await queryRunner.manager.save(AnswerLike, {
            ...flag,
            answer: updAnswer,
            isLike: true,
          });
          await queryRunner.commitTransaction();
          return likeRes;
        }
      } else {
        const updAnswer = await queryRunner.manager.save(Answer, {
          ...answer,
          likecount: --answer.likecount,
        });
        const undoLikeRes = await queryRunner.manager.save(AnswerLike, {
          ...flag,
          answer: updAnswer,
          isLike: false,
        });
        await queryRunner.commitTransaction();
        return undoLikeRes;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async dislikeToggle({ answerId, currentUser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const flag = await queryRunner.manager.findOne(
        AnswerLike,
        { user: { id: currentUser.id }, answer: { id: answerId } },
        { relations: ['user', 'answer', 'answer.question'] },
      );
      console.log('💛flag', flag);

      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { relations: ['coachProfile'] },
      );
      const answer = await queryRunner.manager.findOne(
        Answer,
        { id: answerId },
        { relations: ['question'] },
      );

      if (flag === undefined) {
        const updAnswer = await queryRunner.manager.save(Answer, {
          ...answer,
          likecount: ++answer.dislikecount,
        });
        const dislikeRes = await queryRunner.manager.save(AnswerLike, {
          ...flag,
          answer: updAnswer,
          idDislike: true,
        });
        await queryRunner.commitTransaction();
        return dislikeRes;
      } else if (!flag.idDislike) {
        if (flag.isLike) {
          const updAnswer = await queryRunner.manager.save(Answer, {
            ...answer,
            likecount: --answer.likecount,
            dislikecount: ++answer.dislikecount,
          });
          const dislike = await queryRunner.manager.save(AnswerLike, {
            ...flag,
            answer: updAnswer,
            isLike: false,
            idDislike: true,
          });
          await queryRunner.commitTransaction();
          return dislike;
        } else {
          const updAnswer = await queryRunner.manager.save(Answer, {
            ...answer,
            dislikecount: ++answer.dislikecount,
          });
          const dislike = await queryRunner.manager.save(AnswerLike, {
            ...flag,
            answer: updAnswer,
            idDislike: true,
          });
          await queryRunner.commitTransaction();
          return dislike;
        }
      } else {
        const updAnswer = await queryRunner.manager.save(Answer, {
          ...answer,
          dislikecount: --answer.dislikecount,
        });

        const undoDislike = await queryRunner.manager.save(AnswerLike, {
          ...flag,
          answer: updAnswer,
          idDislike: false,
        });
        await queryRunner.commitTransaction();
        return undoDislike;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
