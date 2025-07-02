import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "./entity/users.entity";
import { Employees } from "./entity/employees.entity";
import { Surveys } from "./entity/survey.entity";
import { Survey_References } from "./entity/survey_references.entity";
import { Responses } from "./entity/responses.entity";
import { Questions } from "./entity/questions.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "halords",
    password: "jamora01",
    database: "survey_app",
    synchronize: false, // IMPORTANT: must be false for migrations
    logging: true,
    entities: [
        Users,
        Employees,
        Surveys,
        Survey_References,
        Responses,
        Questions
    ], // all your entities
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});