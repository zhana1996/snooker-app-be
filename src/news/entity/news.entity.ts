import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('NEWS')
export class NewsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    url: string;

    @Column({ nullable: false })
    image: string;
}