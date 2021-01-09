import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '../config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
    constructor(private config: ConfigService) {}
    createTypeOrmOptions(): TypeOrmModuleOptions {
      return {
        type: 'mysql',
        host: this.config.get('DB_HOST'),
        port: +this.config.get('DB_PORT'),
        username: this.config.get('DB_USERNAME'),
        password: this.config.get('DB_PASSWORD'),
        database: this.config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        timezone: 'local',
      };
    }
  }
