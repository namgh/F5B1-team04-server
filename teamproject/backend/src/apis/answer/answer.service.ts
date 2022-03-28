import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, IsNull, Not, Repository } from 'typeorm';
import { CoachProfile } from '../coach/entities/coachprofile.entity';
import { Deposit, DEPOSIT_STATUS } from '../deposit/entities/deposit.entity';
import { OrderHistory } from '../order/entities/order.entity';
import { Question } from '../question/entities/question.entity';
import { User } from '../user/entities/user.entity';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    // @InjectRepository(Deposit)
    // private readonly depositRepository: Repository<Deposit>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CoachProfile)
    private readonly coachRepository: Repository<CoachProfile>,

    private readonly connection: Connection,
  ) {}

  async findAnswerListOrderByHighScoreDesc({ itemCount }) {
    return await getRepository(Answer)
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('question.fromUser', 'user')
      .leftJoinAndSelect('question.toCoach', 'coach')
      .orderBy('answer.likecount', 'DESC')
      .take(itemCount)
      .getMany();
  }

  async findMyHasAnswerCoaching({ currentUser }) {
    const question = await this.questionRepository.find({
      where: { fromUser: { id: currentUser.id } },
    });
    const QIds = question.map((e) => e.id);
    const answered = await getRepository(Answer)
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('question.fromUser', 'user')
      .leftJoinAndSelect('question.toCoach', 'coach')
      .where('question.id IN (:id)', { id: QIds })
      .getMany();
    console.log(answered);
    return answered;
  }

  async findAllCoachAnswer({ currentUser }) {
    const question = await this.questionRepository.find({
      where: { toCoach: { id: currentUser.id } },
    });
    const QIds = question.map((e) => e.id);
    const answered = await getRepository(Answer)
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('question.fromUser', 'user')
      .leftJoinAndSelect('question.toCoach', 'coach')
      .where('question.id IN (:id)', { id: QIds })
      .getMany();
    // console.log(answered);
    return answered;
  }

  async create({ questionId, createAnswerInput }) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    /**
     * qusetionId -> depositid
     * 1. deposit update ('COMPLETED')
     * 2. coachUser point ++
     * 3. order (user/ )
     * 4. answer save
     */
    try {
      const question = await queryRunner.manager.findOne(Question, {
        where: { id: questionId },
        relations: ['fromUser', 'toCoach', 'toCoach.coachProfile'],
      });
      const deposit = await queryRunner.manager.findOne(Deposit, {
        id: question.deposit,
      });
      await queryRunner.manager.save({
        ...deposit,
        toAmount: deposit.fromAmount,
        fromAmount: 0,
        status: DEPOSIT_STATUS.COMPLETED,
      });

      await queryRunner.manager.save(User, {
        ...question.toCoach,
        point: question.toCoach.point + deposit.fromAmount,
      });

      const answer = await queryRunner.manager.save({
        ...createAnswerInput,
        question,
      });

      const order = await queryRunner.manager.save(OrderHistory, {
        user: question.fromUser,
        answer,
        amount: deposit.fromAmount,
      });
      console.log('💛order', order);
      await queryRunner.commitTransaction();
      return answer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async update({ answerId, updateAnswerInput }) {
    const prevAnswer = this.answerRepository.findOne({
      where: { id: answerId },
      relations: ['question', 'question.toCoach', 'question.fromUser'],
    });

    return await this.answerRepository.save({
      ...prevAnswer,
      ...updateAnswerInput,
    });
  }

  async delete({ answerId }) {
    const delRes = await this.answerRepository.softDelete({
      id: answerId,
    });
    return delRes.affected ? true : false;
  }
}
