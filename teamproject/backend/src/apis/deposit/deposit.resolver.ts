import { Query, Resolver } from '@nestjs/graphql';
import { DepositService } from './deposit.service';

@Resolver()
export class DepositResolver {
  constructor(private readonly depositService: DepositService) {}

  @Query(() => String)
  stringReturn() {
    return 'Hello';
  }
}
