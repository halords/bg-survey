import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Surveys } from "./survey.entity";

@Entity()
export class Employees {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    full_name: string;

    @Column()
    position: string;

    @OneToMany(() => Surveys, survey => survey.employee)
    surveys: Surveys[];
}