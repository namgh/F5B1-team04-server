import {
  ConflictException,
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
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

  async findMyPointHistory({ currentUser }) {
    return await this.pointTransactionRepository.find({
      order: { createdAt: 'DESC' },
      where: { user: { id: currentUser.id } },
      relations: ['user'],
    });
  }
  async fetchpointHistorybypage({ page, perpage }) {
    if (!page) page = 0;
    if (!perpage) perpage = 10;
    return await getRepository(PointTransaction)
      .createQueryBuilder('point_transaction')
      .leftJoinAndSelect('point_transaction.user', 'user')
      .orderBy('point_transaction.createdAt', 'DESC')
      .skip(page * perpage)
      .take(perpage)
      .getMany();
  }

  async fetchmypointHistorybypage({ page, perpage, currentUser }) {
    if (!page) page = 0;
    if (!perpage) perpage = 10;
    return await getRepository(PointTransaction)
      .createQueryBuilder('point_transaction')
      .leftJoinAndSelect('point_transaction.user', 'user')
      .orderBy('point_transaction.createdAt', 'DESC')
      .where('user.id = :id', { id: currentUser.id })
      .skip(page * perpage)
      .take(perpage)
      .getMany();
  }

  async create({ impUid, amount, currentUser, access_token }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      //impUid ???????????? ??????
      const existed = await queryRunner.manager.findOne(
        PointTransaction,
        { impUid },
        { lock: { mode: 'pessimistic_write' } },
      );
      if (existed) throw new ConflictException('?????? ????????? ????????????.');
      //pointTransaction DB ??????
      const pointTransaction = this.pointTransactionRepository.create({
        impUid,
        amount,
        user: currentUser,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });
      await queryRunner.manager.save(pointTransaction);
      //user DB point ??? ????????????
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
      throw new HttpException(error.response.message, error.status);
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
      if (canceledRes) throw new ConflictException('?????? ????????? ??????????????????.');

      const paidRes = await queryRunner.manager.findOne(PointTransaction, {
        impUid,
        user: { id: currentUser.id },
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });
      if (!paidRes)
        throw new UnprocessableEntityException(
          '?????? ????????? ???????????? ????????????.',
        );

      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );
      if (user.point < paidRes.amount)
        throw new UnprocessableEntityException(
          '????????? ????????? ???????????? ????????????.',
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
        user: currentUser,
        status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
      });
      const updatedUser = this.userPository.create({
        ...user,
        point: user.point - cancel_amount,
      });
      await queryRunner.manager.save(afterCanceled);
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      return afterCanceled;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.response.message, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
