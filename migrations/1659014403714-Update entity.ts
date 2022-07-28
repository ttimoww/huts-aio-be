import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateEntity1659014403714 implements MigrationInterface {
    name = 'UpdateEntity1659014403714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "update" ("updateId" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "version" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_e35fb7344a2dac9ed9ef6ad5ce3" PRIMARY KEY ("updateId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "update"`);
    }

}
