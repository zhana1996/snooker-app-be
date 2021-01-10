import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseConfigService } from './config/database-config/database-config.service';
import { Module } from '@nestjs/common';
import { TournamentModule } from './tournament/tournament.module';
import { TournamentParticipantModule } from './tournament-participant/tournament-participant.module';
import { TrainingModule } from './training/training.module';
import { TrainingParticipantModule } from './training-participant/training-participant.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
    TournamentModule,
    TrainingModule,
    TrainingParticipantModule,
    TournamentParticipantModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
