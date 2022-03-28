import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { Answer } from '../answer/entities/answer.entity';
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
        id: currentUser.id,
      }); //{lock: {mode: 'pessimistic_write'}}
      const answer = await queryRunner.manager.findOne(Answer, {
        id: answerId,
      });
      const order = await queryRunner.manager.findOne(OrderHistory, {
        user: { id: currentUser.id },
        answer: { id: answerId },
      });

      if (user.point < answer.amount) {
        throw new UnprocessableEntityException(
          '포인트 잔액이 충분하지 않습니다.',
        );
      }

      if (order) {
        throw new ConflictException('이미 구매하신 답변 내용입니다.');
      }

      await queryRunner.manager.save({
        ...user,
        point: user.point - answer.amount,
      });

      const createOrder = this.orderRepository.create({
        user,
        answer,
        amount: answer.amount,
        status: ORDER_STATUS.PAYMENT,
      });
      const res = await queryRunner.manager.save(createOrder);
      await queryRunner.commitTransaction();
      return res;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async cancel({ currentUser, answerId }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const order = await queryRunner.manager.findOne(OrderHistory, {
        user: { id: currentUser.id },
        answer: { id: answerId },
      });

      if (order.status === 'CANCEL') {
        throw new ConflictException('이미 취소된 결제건입니다.');
      }
      if (order.status !== 'PAYMENT') {
        throw new ConflictException('구매 내역이 없습니다.');
      }

      const cancel = await queryRunner.manager.save({
        ...order,
        amount: -order.amount,
        status: ORDER_STATUS.CANCEL,
      });

      const user = await queryRunner.manager.findOne(User, {
        id: currentUser.id,
      });
      await queryRunner.manager.save({
        ...user,
        point: Number(user.point) - Number(cancel.amount),
      });

      await queryRunner.commitTransaction();
      return cancel;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
