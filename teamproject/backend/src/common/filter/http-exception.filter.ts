import {
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Context, GqlExecutionContext } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;

    console.log('=======================');
    console.log('에러 발생');
    console.log('에러내용:', message);
    console.log('에러코드:', status);
    console.log('=======================');

    (context: ExecutionContext) => {
      const gqlContext = GqlExecutionContext.create(context);
      return gqlContext.getContext().res;
    };
  }
}
