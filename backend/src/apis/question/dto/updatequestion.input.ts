import { Field, InputType } from '@nestjs/graphql';
import { QUESTION_FIELD_ENUM } from '../entities/question.entity';

@InputType()
export class UpdateQuestionInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => QUESTION_FIELD_ENUM, { defaultValue: QUESTION_FIELD_ENUM.NORM })
  Qtype: QUESTION_FIELD_ENUM;
}
