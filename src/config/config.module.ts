import { ConfigService } from './config.service';
import { DatabaseConfigService } from './database-config/database-config.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`.env`),
    },
    DatabaseConfigService
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
