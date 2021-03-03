import * as bcrypt from 'bcrypt';

import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Exclude } from 'class-transformer';
import { TorunamentParticipantEntity } from 'src/tournament-participant/entity/tournament-participant.entity';
import { TrainingEntity } from 'src/training/entity/training.entity';
import { TrainingParticipantEntity } from 'src/training-participant/entity/training-participant.entity';
import { UserDetails } from './user-details.entity';
import { UserRole } from '../enum/user-role.enum';

@Entity('USER')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    email: string;
  
    @Column({ unique: true, nullable: false })
    username: string;
  
    @Column({ nullable: false })
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({ nullable: false, default: UserRole.PLAYER })
    role: UserRole;

    @Column({ default: false })
    isEnabled: boolean;

    @Column({ nullable: true })
    notificationToken: string;

    @OneToOne(() => UserDetails, userDetails => userDetails.user, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    userDetails: UserDetails;

    @OneToMany(() => TrainingEntity, training => training.user)
    trainings: TrainingEntity[];

    @OneToMany(() => TrainingParticipantEntity, training => training.player)
    participants: TrainingParticipantEntity[];

    @OneToMany(() => TorunamentParticipantEntity, participants => participants.user)
    tournamentParticipants: TorunamentParticipantEntity[];
  
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);  
    }

}
