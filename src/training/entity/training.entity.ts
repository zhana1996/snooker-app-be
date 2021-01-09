import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TrainingParticipantEntity } from 'src/training-participant/entity/training-participant.entity';
import { User } from 'src/user/entity/user.entity';

@Entity('TRAINING')
export class TrainingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @ManyToOne(() => User, user => user.trainings)
    @JoinColumn({ name: 'trainer_id', referencedColumnName: 'id' })
    user: User;

    @OneToOne(() => TrainingParticipantEntity, participant => participant.training)
    participant: TrainingParticipantEntity;
}