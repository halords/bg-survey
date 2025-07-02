import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Surveys } from "./survey.entity";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @OneToMany(() => Surveys, survey => survey.user)
    surveys: Surveys[];
}