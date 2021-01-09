import { Module } from '@nestjs/common';
import { TrainingModule } from 'src/training/training.module';
import { TrainingParticipantController } from './controller/training-participant.controller';
import { TrainingParticipantEntity } from './entity/training-participant.entity';
import { TrainingParticipantService } from './service/training-participant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([TrainingParticipantEntity]), TrainingModule, UserModule],
  providers: [TrainingParticipantService],
  controllers: [TrainingParticipantController]
})
export class TrainingParticipantModule {}
