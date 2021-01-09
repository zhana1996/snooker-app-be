import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}