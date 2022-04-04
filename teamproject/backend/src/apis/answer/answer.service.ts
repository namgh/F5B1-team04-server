import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, IsNull, Not, Repository } from 'typeorm';
import { CoachProfile } from '../coach/entities/coachprofile.entity';
import { Deposit, DEPOSIT_STATUS } from '../deposit/entities/deposit.entity';
import { OrderHistory } from '../order/entities/order.entity';
import {
  Question,
  QUESTION_FIELD_ENUM,
} from '../question/entities/question.entity';
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

  async findAnswerListOrderByHigthScorePerCoach({ itemCount, coachId }) {
    const x = await this.answerRepository.find({
      where: { question: { toCoach: coachId } },
      relations: [
        'question',
        'question.fromUser',
        'question.toCoach',
        'question.toCoach.coachProfile',
      ],
      order: { likecount: 'DESC' },
      take: itemCount,
    });

    console.log(x);
  }

  async findQnACoachingListForClient() {
    const x = await this.answerRepository.find({
      relations: [
        'question',
        'question.fromUser',
        'question.toCoach',
        'question.toCoach.coachProfile',
      ],
    });
    console.log(x);
    return x;
  }

  async findQnAListPerCoach({ coachId }) {
    return await this.answerRepository.find({
      where: { question: { toCoach: { id: coachId } } },
      relations: [
        'question',
        'question.fromUser',
        'question.toCoach',
        'question.toCoach.coachProfile',
      ],
    });
  }

  async findMyHasAnswerCoaching({ currentUser }) {
    const question = await this.questionRepository.find({
      where: { fromUser: { id: currentUser.id } },
      relations: ['fromUser', 'toCoach'],
    });

    console.log('💛question', question);

    const QIds = question.map((e) => e.id);
    console.log('💛QID', QIds);
    const answered = await getRepository(Answer)
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('question.fromUser', 'user')
      .leftJoinAndSelect('question.toCoach', 'coach')
      .leftJoinAndSelect('coach.coachProfile', 'profile')
      .where('question.id IN (:id)', { id: QIds })
      .getMany();
    console.log('💛answered', answered);
    return answered;
  }

  async findAllCoachAnswercoach({ currentUser }) {
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

  async findAllCoachAnswer() {
    const answered = await getRepository(Answer)
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('question.fromUser', 'user')
      .leftJoinAndSelect('question.toCoach', 'coach')
      .orderBy('answer.createdAt', 'DESC')
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
      console.log('💛question', question);
      const deposit = await queryRunner.manager.findOne(Deposit, {
        id: question.deposit,
      });
      console.log('💛', deposit);
      console.log('💛', deposit.fromAmount);

      const x = await queryRunner.manager.save(Deposit, {
        ...deposit,
        toAmount: deposit.fromAmount,
        fromAmount: 0,
        status: DEPOSIT_STATUS.COMPLETED,
      });
      console.log(x);

      const y = await queryRunner.manager.save(User, {
        ...question.toCoach,
        point: question.toCoach.point + deposit.fromAmount,
      });

      //answer:question 은 1:1 관계 이기에 같은 questionId를 갖는 question을 주입하려고 할 때 에러!
      //중복 검사 안해도됨

      const answer = await queryRunner.manager.save(Answer, {
        ...createAnswerInput,
        question,
        amount: deposit.fromAmount,
      });
      const c = answer.question.toCoach.coachProfile;
      console.log(c);
      const order = await queryRunner.manager.save(OrderHistory, {
        user: question.fromUser,
        answer,
        amount: answer.amount,
      });
      await queryRunner.commitTransaction();
      return answer;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async update({ answerId, updateAnswerInput }) {
    const prevAnswer = await this.answerRepository.findOne({
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
