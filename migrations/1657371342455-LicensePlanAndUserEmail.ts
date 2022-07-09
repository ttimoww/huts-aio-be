import {MigrationInterface, QueryRunner} from "typeorm";

export class LicensePlanAndUserEmail1657371342455 implements MigrationInterface {
    name = 'LicensePlanAndUserEmail1657371342455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "license" ADD "plan" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "license" DROP COLUMN "plan"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    }

}
