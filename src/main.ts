import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { startDb } from './dbs/index';

import { TransformInterceptor } from './interceptor/transform.interceptor';
import { LoggingInterceptor } from './interceptor/aa';

async function bootstrap() {
  startDb();
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      maxAge: 86400,
      allowedHeaders: 'content-type, Authorization',
    },
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
