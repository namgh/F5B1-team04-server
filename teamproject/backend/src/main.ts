import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://cucutoo.shop',
      'https://cucutoo.shop',
      'https://cucutoo.com',
      'http://cucutoo.com',
    ],
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
