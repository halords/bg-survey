"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./entity/users.entity");
const employees_entity_1 = require("./entity/employees.entity");
const survey_entity_1 = require("./entity/survey.entity");
const survey_references_entity_1 = require("./entity/survey_references.entity");
const responses_entity_1 = require("./entity/responses.entity");
const questions_entity_1 = require("./entity/questions.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "halords",
    password: "jamora01",
    database: "survey_app",
    synchronize: false, // IMPORTANT: must be false for migrations
    logging: true,
    entities: [
        users_entity_1.Users,
        employees_entity_1.Employees,
        survey_entity_1.Surveys,
        survey_references_entity_1.Survey_References,
        responses_entity_1.Responses,
        questions_entity_1.Questions
    ], // all your entities
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});
