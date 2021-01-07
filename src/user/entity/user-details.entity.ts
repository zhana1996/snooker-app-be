import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';
import { UserGenderEnum } from '../enum/user-gender.enum';

@Entity()
export class UserDetails {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    age: number;

    @Column({ nullable: false })
    name: string;

    @Column('enum', { enum: UserGenderEnum, nullable: false })
    gender: UserGenderEnum;
  
    @Column({ nullable: false })
    break: number;
  
    @Column({ nullable: false })
    club: string;

    @Column({ nullable: false })
    image: string;
  
    @Column({ nullable: true })
    startDate: Date;
    
    @Column({ nullable: true })
    titles: number;

    @Column({ nullable: true })
    rank: number;

    @Column({ nullable: true })
    wins: number;

    @Column({ nullable: true })
    losts: number;

    @Column({ nullable: true })
    matches: number;

    @Column({ nullable: true })
    points: number;

    @OneToOne(() => User, user => user.userDetails, { onDelete: 'CASCADE' })
    user: User;
}