import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnLike } from '../columnlike/entities/columnlike.entity';
import { User } from '../user/entities/user.entity';
import { CoachColumnResolver } from './column.resolver';
import { CoachColumnService } from './column.service';
import { CoachColumn } from './entities/column.entity';

import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CoachColumn,
      ColumnLike,
      User, //
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    CoachColumnResolver, //
    CoachColumnService,
  ],
})
export class CoachColumnModule {}
