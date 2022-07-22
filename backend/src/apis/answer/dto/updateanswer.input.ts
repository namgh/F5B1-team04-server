import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAnswerInput {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  contents: string;

  @Field(() => Int, { nullable: true })
  amount: number;
}
