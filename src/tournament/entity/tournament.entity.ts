import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TorunamentParticipantEntity } from 'src/tournament-participant/entity/tournament-participant.entity';

@Entity('TOURNAMENT')
export class TournamentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    place: string;

    @Column({ type: 'timestamp', nullable: false })
    startDate: Date;

    @Column({ nullable: false })
    season: string;

    @OneToMany(() => TorunamentParticipantEntity, participants => participants.tournament)
    tournamentParticipants: TorunamentParticipantEntity[];
}