import { Module } from '@nestjs/common';
import { TournamentController } from './controller/tournament.controller';
import { TournamentEntity } from './entity/tournament.entity';
import { TournamentService } from './service/tournament.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentEntity])],
  controllers: [TournamentController],
  providers: [TournamentService]
})
export class TournamentModule {}
