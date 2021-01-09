import { Module } from '@nestjs/common';
import { TrainingController } from './controller/training.controller';
import { TrainingEntity } from './entity/training.entity';
import { TrainingService } from './service/training.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingEntity]), UserModule],
  controllers: [TrainingController],
  providers: [TrainingService]
})
export class TrainingModule {}
