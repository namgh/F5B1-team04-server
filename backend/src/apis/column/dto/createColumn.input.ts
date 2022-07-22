import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateColumnInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;
}
