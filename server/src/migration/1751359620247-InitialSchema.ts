import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1751359620247 implements MigrationInterface {
    name = 'InitialSchema1751359620247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`responses\` DROP FOREIGN KEY \`responses_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`responses\` DROP FOREIGN KEY \`responses_ibfk_2\``);
        await queryRunner.query(`ALTER TABLE \`survey_references\` DROP FOREIGN KEY \`survey_references_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`surveys\` DROP FOREIGN KEY \`surveys_ibfk_1\``);
        await queryRunner.query(`DROP INDEX \`reference_id\` ON \`responses\``);
        await queryRunner.query(`DROP INDEX \`survey_id\` ON \`survey_references\``);
        await queryRunner.query(`DROP INDEX \`token\` ON \`survey_references\``);
        await queryRunner.query(`DROP INDEX \`employee_id\` ON \`surveys\``);
        await queryRunner.query(`DROP INDEX \`email\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`surveys\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`arrange_order\` \`arrange_order\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`status\` varchar(255) NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE \`responses\` CHANGE \`rating\` \`rating\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`responses\` DROP COLUMN \`comments\``);
        await queryRunner.query(`ALTER TABLE \`responses\` ADD \`comments\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`responses\` CHANGE \`reference_id\` \`reference_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` CHANGE \`full_name\` \`full_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`survey_references\` ADD \`token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` DROP COLUMN \`link\``);
        await queryRunner.query(`ALTER TABLE \`survey_references\` ADD \`link\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` CHANGE \`submitted\` \`submitted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` CHANGE \`is_submitted\` \`is_submitted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` DROP COLUMN \`submitted_at\``);
        await queryRunner.query(`ALTER TABLE \`survey_references\` ADD \`submitted_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` DROP COLUMN \`notification_type\``);
        await queryRunner.query(`ALTER TABLE \`survey_references\` ADD \`notification_type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` CHANGE \`survey_id\` \`survey_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`surveys\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`surveys\` CHANGE \`full_name\` \`full_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surveys\` CHANGE \`position\` \`position\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surveys\` CHANGE \`employee_id\` \`employee_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`responses\` ADD CONSTRAINT \`FK_f654c10e0d2df967e06013eb3d4\` FOREIGN KEY (\`reference_id\`) REFERENCES \`survey_references\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`responses\` ADD CONSTRAINT \`FK_2e0ddaf5cd2cf79e66c77b1e8b6\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` ADD CONSTRAINT \`FK_b3a40dac97e80c86d6d890ab664\` FOREIGN KEY (\`survey_id\`) REFERENCES \`surveys\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`surveys\` ADD CONSTRAINT \`FK_7f03141de6483aba4a5fed287c0\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`surveys\` ADD CONSTRAINT \`FK_3e312e00b31402a7e6093db119a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`surveys\` DROP FOREIGN KEY \`FK_3e312e00b31402a7e6093db119a\``);
        await queryRunner.query(`ALTER TABLE \`surveys\` DROP FOREIGN KEY \`FK_7f03141de6483aba4a5fed287c0\``);
        await queryRunner.query(`ALTER TABLE \`survey_references\` DROP FOREIGN KEY \`FK_b3a40dac97e80c86d6d890ab664\``);
        await queryRunner.query(`ALTER TABLE \`responses\` DROP FOREIGN KEY \`FK_2e0ddaf5cd2cf79e66c77b1e8b6\``);
        await queryRunner.query(`ALTER TABLE \`responses\` DROP FOREIGN KEY \`FK_f654c10e0d2df967e06013eb3d4\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`created_at\` \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`surveys\` CHANGE \`employee_id\` \`employee_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surveys\` CHANGE \`position\` \`position\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`surveys\` CHANGE \`full_name\` \`full_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`surveys\` CHANGE \`created_at\` \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` CHANGE \`survey_id\` \`survey_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` DROP COLUMN \`notification_type\``);
        await queryRunner.query(`ALTER TABLE \`survey_references\` ADD \`notification_type\` varchar(45) NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` DROP COLUMN \`submitted_at\``);
        await queryRunner.query(`ALTER TABLE \`survey_references\` ADD \`submitted_at\` varchar(45) NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` CHANGE \`is_submitted\` \`is_submitted\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` CHANGE \`submitted\` \`submitted\` tinyint(1) NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` DROP COLUMN \`link\``);
        await queryRunner.query(`ALTER TABLE \`survey_references\` ADD \`link\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`survey_references\` ADD \`token\` char(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` CHANGE \`full_name\` \`full_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`responses\` CHANGE \`reference_id\` \`reference_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`responses\` DROP COLUMN \`comments\``);
        await queryRunner.query(`ALTER TABLE \`responses\` ADD \`comments\` varchar(2000) NULL`);
        await queryRunner.query(`ALTER TABLE \`responses\` CHANGE \`rating\` \`rating\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`status\` varchar(45) NULL`);
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`arrange_order\` \`arrange_order\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`surveys\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`email\` ON \`users\` (\`email\`)`);
        await queryRunner.query(`CREATE INDEX \`employee_id\` ON \`surveys\` (\`employee_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`token\` ON \`survey_references\` (\`token\`)`);
        await queryRunner.query(`CREATE INDEX \`survey_id\` ON \`survey_references\` (\`survey_id\`)`);
        await queryRunner.query(`CREATE INDEX \`reference_id\` ON \`responses\` (\`reference_id\`)`);
        await queryRunner.query(`ALTER TABLE \`surveys\` ADD CONSTRAINT \`surveys_ibfk_1\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`survey_references\` ADD CONSTRAINT \`survey_references_ibfk_1\` FOREIGN KEY (\`survey_id\`) REFERENCES \`surveys\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`responses\` ADD CONSTRAINT \`responses_ibfk_2\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`responses\` ADD CONSTRAINT \`responses_ibfk_1\` FOREIGN KEY (\`reference_id\`) REFERENCES \`survey_references\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
