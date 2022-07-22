import {
  ConflictException,
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { Answer } from '../answer/entities/answer.entity';
import { Question } from '../question/entities/question.entity';
import { User } from '../user/entities/user.entity';
import { OrderHistory, ORDER_STATUS } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderHistory)
    private readonly orderRepository: Repository<OrderHistory>,

    private readonly connection: Connection,
  ) {}

  async create({ currentUser, answerId }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: currentUser.id },
        relations: ['coachProfile'],
      });
      const answer = await queryRunner.manager.findOne(Answer, {
        where: { id: answerId },
        relations: ['question'],
      });
      const order = await queryRunner.manager.findOne(OrderHistory, {
        where: {
          user: { id: currentUser.id },
          answer: { id: answerId },
        },
        relations: ['user', 'answer'],
      });
      console.log('💛user', user);
      console.log('💛answer', answer);
      console.log('💛order', order);
      console.log('💛💛💛💛💛💛', answer.question.id);
      const DidIGotthisQ = await queryRunner.manager.findOne(Question, {
        where: {
          id: answer.question.id,
          toCoach: { id: currentUser.id },
        },
      });
      console.log('💛isMine', DidIGotthisQ);
      if (DidIGotthisQ) {
        return new ConflictException(`${user.name} 코치님의 답변입니다`);
      }

      if (user.point < answer.amount) {
        return new UnprocessableEntityException(
          '포인트 잔액이 충분하지 않습니다.',
        );
      }

      if (order) {
        return new ConflictException('이미 구매하신 답변 내용입니다.');
      }

      const minusUser = await queryRunner.manager.save(User, {
        ...user,
        point: user.point - answer.amount,
      });
      console.log('💛userpoint--', minusUser);

      const createOrder = this.orderRepository.create({
        user: minusUser,
        answer,
        amount: answer.amount,
        status: ORDER_STATUS.PAYMENT,
      });
      console.log('💛createdOrder', createOrder);
      const res = await queryRunner.manager.save(createOrder);
      console.log('💛res', res);
      await queryRunner.commitTransaction();
      return res;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.response.message, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async cancel({ userId, answerId }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const order = await queryRunner.manager.findOne(OrderHistory, {
        where: {
          user: { id: userId },
          answer: { id: answerId },
        },
        relations: ['user', 'answer'],
      });
      console.log('💛', order);
      if (order.status === 'CANCEL') {
        return new ConflictException('이미 취소된 결제건입니다.');
      }
      if (order.status !== 'PAYMENT') {
        return new ConflictException('구매 내역이 없습니다.');
      }

      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['coachProfile'],
      });
      console.log('💛user', user);

      const cancel = await queryRunner.manager.save(OrderHistory, {
        user,
        answer: order.answer,
        amount: -order.amount,
        status: ORDER_STATUS.CANCEL,
      });
      console.log('💛---c', cancel);

      const x = await queryRunner.manager.save(User, {
        ...user,
        point: Number(user.point) - Number(cancel.amount),
      });
      console.log('💛user++', x);
      await queryRunner.commitTransaction();
      return cancel;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.response.message, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
