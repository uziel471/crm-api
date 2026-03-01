import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { WorkflowModule } from '@modules/workflow-config/workflow-config.module';
import { Lead, LeadSchema } from '@modules/leads/schemas/leads.schema';
import { User, UserSchema } from '@modules/users/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lead.name,
        schema: LeadSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    WorkflowModule,
  ],
  providers: [LeadsService],
  controllers: [LeadsController],
})
export class LeadsModule {}
