import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Survey_References } from "./survey_references.entity";
import { Questions } from "./questions.entity";

@Entity()
export class Responses {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Survey_References, reference => reference.responses)
    @JoinColumn({ name: 'reference_id' })
    reference: Survey_References;

    @ManyToOne(() => Questions)
    @JoinColumn({ name: 'question_id' })
    question: Questions;

    @Column()
    rating: number;

    @Column({ type: 'text', nullable: true })
    comments: string;
}
