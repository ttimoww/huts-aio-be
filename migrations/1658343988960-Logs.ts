import {MigrationInterface, QueryRunner} from "typeorm";

export class Logs1658343988960 implements MigrationInterface {
    name = 'Logs1658343988960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."log_store_enum" AS ENUM('zalando', 'snipes', 'solebox', 'lvr', 'kith', 'supreme')`);
        await queryRunner.query(`CREATE TABLE "log" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "store" "public"."log_store_enum", "error" character varying, "extraInfo" character varying, "type" character varying NOT NULL, "userUserId" integer, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22b3994de470097e74a600bb1d" ON "log" ("type") `);
        await queryRunner.query(`ALTER TABLE "log" ADD CONSTRAINT "FK_0a0d1e4cf6aaccc0c52b3e241d5" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" DROP CONSTRAINT "FK_0a0d1e4cf6aaccc0c52b3e241d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22b3994de470097e74a600bb1d"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`DROP TYPE "public"."log_store_enum"`);
    }

}
