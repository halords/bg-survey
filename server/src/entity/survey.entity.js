"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Surveys = void 0;
const typeorm_1 = require("typeorm");
const employees_entity_1 = require("./employees.entity");
const users_entity_1 = require("./users.entity");
const survey_references_entity_1 = require("./survey_references.entity");
let Surveys = class Surveys {
};
exports.Surveys = Surveys;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Surveys.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employees_entity_1.Employees, employee => employee.surveys),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employees_entity_1.Employees)
], Surveys.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.Users, user => user.surveys),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", users_entity_1.Users)
], Surveys.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Surveys.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Surveys.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Surveys.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => survey_references_entity_1.Survey_References, reference => reference.survey),
    __metadata("design:type", Array)
], Surveys.prototype, "references", void 0);
exports.Surveys = Surveys = __decorate([
    (0, typeorm_1.Entity)()
], Surveys);
