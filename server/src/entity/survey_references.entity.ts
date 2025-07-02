import { Entity, PrimaryGeneratedColumn, Column , ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { Surveys } from "./survey.entity";
import { Responses } from "./responses.entity";

@Entity('survey_references') // Explicit table name
export class Survey_References {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Surveys, survey => survey.references)
    @JoinColumn({ name: 'survey_id' })
    survey: Surveys;

    @Column()
    full_name: string;

    @Column()
    token: string;

    @Column()
    link: string;

    @Column({ default: false })
    submitted: boolean;

    @Column()
    email: string;

    @Column({ default: false, name: 'is_submitted' })
    isSubmitted: boolean;

    @Column({ nullable: true, type: 'timestamp' })
    submitted_at: Date;

    @Column()
    notification_type: string;

    @OneToMany(() => Responses, response => response.reference)
    responses: Responses[];
}