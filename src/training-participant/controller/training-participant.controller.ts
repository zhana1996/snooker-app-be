import { Body, Controller, Post } from '@nestjs/common';
import { TrainingParticipantEntity } from '../entity/training-participant.entity';
import { TrainingParticipantService } from '../service/training-participant.service';

@Controller('training-participant')
export class TrainingParticipantController {
    constructor(private trainingParticipantService: TrainingParticipantService) {}

    @Post()
    async apply(@Body() trainingParticipant: TrainingParticipantEntity) {
        return this.trainingParticipantService.apply(trainingParticipant);
    }
}
