import { Field, InputType } from '@nestjs/graphql';
import { QUESTION_FIELD_ENUM } from '../entities/question.entity';

@InputType()
export class CreateQuestionInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => String, { nullable: true })
  QType: string;
}
