import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateChangelog1659388071335 implements MigrationInterface {
    name = 'UpdateChangelog1659388071335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "update" ADD "changelog" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "update" DROP COLUMN "changelog"`);
    }

}
