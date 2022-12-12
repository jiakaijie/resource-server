import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VersionsModule } from './module/versions/versions.module';
import { ResourcesModule } from './module/resources/resources.module';
import { UsersModule } from './module/users/users.module';

import { ResourcesController } from './module/resources/resources.controller';
import { UsersController } from './module/users/users.controller';
import { VersionsController } from './module/versions/versions.controller';

import { LoginMiddleware } from './middleware/login';
import { LogMiddleware } from './middleware/log';
import { UploadModule } from './module/upload/upload.module';
@Module({
  imports: [VersionsModule, ResourcesModule, UsersModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogMiddleware)
      .exclude('/api/versions/a')
      .forRoutes(ResourcesController, UsersController, VersionsController);

    consumer
      .apply(LoginMiddleware)
      .exclude('/api/users/login')
      .exclude('/api/upload/files')
      .forRoutes(ResourcesController, UsersController, VersionsController);
  }
}
