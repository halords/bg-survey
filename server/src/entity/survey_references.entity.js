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
exports.Survey_References = void 0;
const typeorm_1 = require("typeorm");
const survey_entity_1 = require("./survey.entity");
const responses_entity_1 = require("./responses.entity");
let Survey_References = class Survey_References {
};
exports.Survey_References = Survey_References;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Survey_References.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => survey_entity_1.Surveys, survey => survey.references),
    (0, typeorm_1.JoinColumn)({ name: 'survey_id' }),
    __metadata("design:type", survey_entity_1.Surveys)
], Survey_References.prototype, "survey", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Survey_References.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Survey_References.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Survey_References.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Survey_References.prototype, "submitted", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Survey_References.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'is_submitted' }),
    __metadata("design:type", Boolean)
], Survey_References.prototype, "isSubmitted", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamp' }),
    __metadata("design:type", Date)
], Survey_References.prototype, "submitted_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Survey_References.prototype, "notification_type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => responses_entity_1.Responses, response => response.reference),
    __metadata("design:type", Array)
], Survey_References.prototype, "responses", void 0);
exports.Survey_References = Survey_References = __decorate([
    (0, typeorm_1.Entity)('survey_references') // Explicit table name
], Survey_References);
