import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingService } from 'src/training/service/training.service';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { TrainingParticipantEntity } from '../entity/training-participant.entity';

@Injectable()
export class TrainingParticipantService {
    constructor(
        @InjectRepository(TrainingParticipantEntity) 
        private trainingParticipantRepository: Repository<TrainingParticipantEntity>,
        private userService: UserService,
        private trainingService: TrainingService) {}

    async apply(participant: TrainingParticipantEntity): Promise<TrainingParticipantEntity> {
        const player = await this.userService.getById(participant.playerId);
        const training = await this.trainingService.getById(participant.trainingId);

        participant.training = training;
        participant.player = player;

        return await this.trainingParticipantRepository.save(participant);
    }
}
