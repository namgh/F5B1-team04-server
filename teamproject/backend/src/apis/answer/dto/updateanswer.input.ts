import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAnswerInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;
}
