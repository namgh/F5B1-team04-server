import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositResolver } from './deposit.resolver';
import { DepositService } from './deposit.service';
import { Deposit } from './entities/deposit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deposit])],
  providers: [DepositResolver, DepositService],
})
export class DepositModule {}
