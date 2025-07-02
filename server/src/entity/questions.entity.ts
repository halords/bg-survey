import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Responses } from "./responses.entity";

@Entity()
export class Questions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    text: string;

    @Column()
    arrange_order: number;

    @Column({ default: 'active' })
    status: string;

    @OneToMany(() => Responses, response => response.question)
    responses: Responses[];
}