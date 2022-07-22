import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BlogCategoryTag } from 'src/apis/blogcategorytag/entities/blogcategofytag.entity';
import { User } from 'src/apis/user/entities/user.entity';

@ObjectType()
export class BlogReturn {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  contents: string;

  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => String)
  status: string;

  @Field(() => String)
  searchcontents: string;

  @Field(() => String)
  updatedat: String;

  @Field(() => [BlogCategoryTag], { nullable: true })
  blogcategorytag: BlogCategoryTag[];

  @Field(() => Int, { nullable: true })
  like: number;
}
