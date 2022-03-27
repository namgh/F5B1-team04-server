import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAnswerInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;
}
