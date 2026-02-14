import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { MongoDBModule } from '@database/mongodb.module';
import configuration from '@config/configuration';
import { validationSchema } from '@config/validation';
import { WorkflowModule } from '@modules/workflow-config/workflow-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    AuthModule,
    UsersModule,
    MongoDBModule,
    WorkflowModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
