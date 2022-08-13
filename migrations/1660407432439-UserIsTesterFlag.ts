import {MigrationInterface, QueryRunner} from "typeorm";

export class UserIsTesterFlag1660407432439 implements MigrationInterface {
    name = 'UserIsTesterFlag1660407432439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isTester" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isTester"`);
    }

}
