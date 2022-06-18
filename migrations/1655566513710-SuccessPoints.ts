import {MigrationInterface, QueryRunner} from "typeorm";

export class SuccessPoints1655566513710 implements MigrationInterface {
    name = 'SuccessPoints1655566513710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "successPoints" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "successPoints"`);
    }

}
