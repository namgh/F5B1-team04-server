import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateColumnInput {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  contents: string;
}
