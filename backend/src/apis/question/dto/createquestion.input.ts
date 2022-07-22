import { Field, InputType } from '@nestjs/graphql';
import { QUESTION_FIELD_ENUM } from '../entities/question.entity';

@InputType()
export class CreateQuestionInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  // @Field(() => QUESTION_FIELD_ENUM)
  // QType: QUESTION_FIELD_ENUM;
  // @Field(() => String, { nullable: true })
  // QType: string;
}
