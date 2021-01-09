import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TrainingEntity } from 'src/training/entity/training.entity';
import { User } from 'src/user/entity/user.entity';

@Entity('TRAINING_PARTICIPANT')
export class TrainingParticipantEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => TrainingEntity, training => training.participant)
    @JoinColumn({ name: 'training_id' })
    training: TrainingEntity;

    @ManyToOne(() => User, user => user.participants)
    @JoinColumn({ name: 'player_id', referencedColumnName: 'id' })
    player: User;

    trainingId: string;
    playerId: string
}