import {MigrationInterface, QueryRunner} from "typeorm";

export class ErrorLogUrl1659771109261 implements MigrationInterface {
    name = 'ErrorLogUrl1659771109261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" ADD "url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" DROP COLUMN "url"`);
    }

}
