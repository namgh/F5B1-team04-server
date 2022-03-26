import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ColumnCommentResolver } from './comment.resolver';
import { ColumnCommentService } from './comment.service';
import { ColumnComment } from './entities/columncomment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      ColumnComment
    ]),
  ],
  providers: [ColumnCommentResolver, ColumnCommentService],
})
export class ColumnCommentModule {}
