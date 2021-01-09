import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseConfigService } from './config/database-config/database-config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentModule } from './tournament/tournament.module';
import { TrainingModule } from './training/training.module';
import { TrainingParticipantModule } from './training-participant/training-participant.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
