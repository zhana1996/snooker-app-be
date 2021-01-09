import * as bcrypt from 'bcrypt';

import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Exclude } from 'class-transformer';
import { UserDetails } from './user-details.entity';
import { UserRole } from '../enum/user-role.enum';

@Entity()
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

    @OneToOne(() => UserDetails, userDetails => userDetails.user, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    userDetails: UserDetails;
  
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);  
    }

}
