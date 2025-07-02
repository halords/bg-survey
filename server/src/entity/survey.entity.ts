import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Employees } from "./employees.entity";
import { Users } from "./users.entity";
import { Survey_References } from "./survey_references.entity";

@Entity()
export class Surveys {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Employees, employee => employee.surveys)
    @JoinColumn({ name: 'employee_id' })
    employee: Employees;

    @ManyToOne(() => Users, user => user.surveys)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column()
    full_name: string;

    @Column()
    position: string;

    @OneToMany(() => Survey_References, reference => reference.survey)
    references: Survey_References[];
}