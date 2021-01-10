import { Module } from '@nestjs/common';
import { TorunamentParticipantController } from './controller/torunament-participant.controller';
import { TorunamentParticipantEntity } from './entity/tournament-participant.entity';
import { TorunamentParticipantService } from './service/torunament-participant.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TorunamentParticipantEntity])],
  controllers: [TorunamentParticipantController],
  providers: [TorunamentParticipantService]
})
export class TournamentParticipantModule {}
