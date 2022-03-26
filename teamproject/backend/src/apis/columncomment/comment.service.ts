import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnComment } from './entities/columncomment.entity';

@Injectable()
export class ColumnCommentService {
  constructor(
    @InjectRepository(ColumnComment)
    private readonly columnCommentRepository: Repository<ColumnComment>,
  ) {}
}
