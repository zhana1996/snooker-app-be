import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseConfigService } from './config/database-config/database-config.service';
import { FileStorageModule } from './file-storage/file-storage.module';
import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { TournamentModule } from './tournament/tournament.module';
import { TournamentParticipantModule } from './tournament-participant/tournament-participant.module';
import { TrainingModule } from './training/training.module';
import { TrainingParticipantModule } from './training-participant/training-participant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    TournamentParticipantModule,
    NewsModule,
    FileStorageModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
