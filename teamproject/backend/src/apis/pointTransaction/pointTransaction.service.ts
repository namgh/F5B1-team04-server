import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
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

    private readonly iamportService: IamportService,

    private readonly connection: Connection,
  ) {}

  async create({ impUid, amount, currentUser, access_token }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      //impUid 유일한지 확인
      const existed = await queryRunner.manager.findOne(
        PointTransaction,
        { impUid },
        { lock: { mode: 'pessimistic_write' } },
      );
      if (existed) throw new ConflictException('이미 결제된 건입니다.');
      //pointTransaction DB 생성
      const pointTransaction = this.pointTransactionRepository.create({
        impUid,
        amount,
        user: currentUser,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });
      await queryRunner.manager.save(pointTransaction);
      //user DB point 값 업데이트
      const user_ = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );
      const updatedUser = this.userPository.create({
        ...user_,
        point: user_.point + amount,
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

  async cancel({ impUid, amount, currentUser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const canceledRes = await queryRunner.manager.findOne(PointTransaction, {
        impUid,
        status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
      });
      if (canceledRes) throw new ConflictException('이미 취소된 결제건입니다.');

      const paidRes = await queryRunner.manager.findOne(PointTransaction, {
        impUid,
        user: { id: currentUser.id },
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });
      if (!paidRes)
        throw new UnprocessableEntityException(
          '결제 기록이 존재하지 않습니다.',
        );

      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );
      if (user.point < paidRes.amount)
        throw new UnprocessableEntityException(
          '포인트 잔액이 충분하지 않습니다.',
        );

      const access_token = await this.iamportService.getImpAccessToken();
      const cancel_amount = await this.iamportService.cancelPayment({
        impUid,
        amount,
        access_token,
      });
      //cancel
      const { id, ...rest } = await queryRunner.manager.findOne(
        PointTransaction,
        { impUid },
        { lock: { mode: 'pessimistic_write' } },
      );

      const afterCanceled = await this.pointTransactionRepository.create({
        ...rest,
        amount: -cancel_amount,
        status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
      });
      const updatedUser = this.userPository.create({
        ...user,
        point: user.point - cancel_amount,
      });
      await queryRunner.manager.save(afterCanceled);
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}