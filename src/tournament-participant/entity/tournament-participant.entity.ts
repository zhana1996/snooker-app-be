import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { TournamentEntity } from "src/tournament/entity/tournament.entity";
import { User } from "src/user/entity/user.entity";

@Entity('TOURNAMENT_PARTICIPANT')
export class TorunamentParticipantEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => TournamentEntity, tournament => tournament.tournamentParticipants)
    tournament: TournamentEntity;

    @ManyToOne(() => User, user => user.tournamentParticipants)
    user: User;
}