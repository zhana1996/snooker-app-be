import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const serviceAccount = require('../snooker-7a584-firebase-adminsdk-v6fts-7f9137626f.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  await app.listen(3000);
}
bootstrap();
