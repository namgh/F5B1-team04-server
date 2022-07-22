import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import {
  PointTransaction,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';

@Injectable()
export class PointTransactionService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly userPository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async create({
    impUid,
    amount,
    currentUser,
    status = POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
  }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const pointTransaction = this.pointTransactionRepository.create({
        impUid,
        amount,
        user: currentUser,
        status,
      });

      await queryRunner.manager.save(pointTransaction);
      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );

      const updatedUser = this.userPository.create({
        ...user,
        point: user.point + amount,
      });

      await queryRunner.manager.save(updatedUser);
      await queryRunner.commitTransaction();

      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async checkDuplicated({ impUid }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      queryRunner.manager.findOne(
        PointTransaction,
        { impUid },
        { lock: { mode: 'pessimistic_write' } },
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    const result = await this.pointTransactionRepository.findOne({ impUid });
    if (result) throw new ConflictException('이미 결제된 건입니다.');
  }

  async checkAlreadyCanceled({ impUid }) {
    const canceledRes = await this.pointTransactionRepository.findOne({
      impUid,
      status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
    });
    if (canceledRes) throw new ConflictException('이미 취소된 결제건입니다.');
  }

  async checkHasEnoughPoint({ impUid, currentUser }) {
    const paidResult = await this.pointTransactionRepository.findOne({
      impUid,
      user: { id: currentUser.id },
      status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
    });
    if (!paidResult)
      throw new UnprocessableEntityException('결제 기록이 존재하지 않습니다.');

    const user_ = await this.userPository.findOne({ id: currentUser.id });
    if (user_.point < paidResult.amount)
      throw new UnprocessableEntityException(
        '포인트 잔액이 충분하지 않습니다.',
      );
  }

  async cancel({ impUid, amount, currentUser }) {
    return await this.create({
      impUid,
      amount: -amount,
      currentUser,
      status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
    });
  }
}
