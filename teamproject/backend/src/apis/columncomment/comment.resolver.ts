import { Resolver } from '@nestjs/graphql';
import { ColumnCommentService } from './comment.service';

@Resolver()
export class ColumnCommentResolver {
  constructor(private readonly columnCommentService: ColumnCommentService) {}
}
