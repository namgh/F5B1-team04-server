import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachColumn } from '../column/entities/column.entity';
import { User } from '../user/entities/user.entity';
import { ColumnlikeResolver } from './columnlike.resolver';
import { ColumnlikeService } from './columnlike.service';
import { ColumnLike } from './entities/columnlike.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ColumnLike, //
      CoachColumn,
      User,
    ]),
  ],
  providers: [ColumnlikeResolver, ColumnlikeService],
})
export class ColumnlikeModule {}
