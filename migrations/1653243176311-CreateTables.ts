import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTables1653243176311 implements MigrationInterface {
    name = 'CreateTables1653243176311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "license" ("licenseId" character varying NOT NULL, "planId" character varying NOT NULL, "key" character varying NOT NULL, "lastValidation" TIMESTAMP NOT NULL, "ip" character varying, "userUserId" integer, CONSTRAINT "PK_2acf58358bbbed1f56bf001cf8f" PRIMARY KEY ("licenseId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("userId" SERIAL NOT NULL, "discordId" character varying NOT NULL, "discordTag" character varying NOT NULL, "discordImage" character varying NOT NULL, CONSTRAINT "UQ_de2d532e1e3c855aa61661d2980" UNIQUE ("discordTag"), CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TYPE "public"."checkout_store_enum" AS ENUM('zalando', 'snipes', 'solebox')`);
        await queryRunner.query(`CREATE TABLE "checkout" ("checkoutId" SERIAL NOT NULL, "store" "public"."checkout_store_enum" NOT NULL, "productName" character varying NOT NULL, "productSize" character varying NOT NULL, "productImage" character varying NOT NULL, "userUserId" integer, CONSTRAINT "PK_e300b1d5c7adcd9d0c7499c8ea7" PRIMARY KEY ("checkoutId"))`);
        await queryRunner.query(`ALTER TABLE "license" ADD CONSTRAINT "FK_febc7bc76c4954d8f8eda814a88" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checkout" ADD CONSTRAINT "FK_c6c247dd8e3341475f7f32df367" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkout" DROP CONSTRAINT "FK_c6c247dd8e3341475f7f32df367"`);
        await queryRunner.query(`ALTER TABLE "license" DROP CONSTRAINT "FK_febc7bc76c4954d8f8eda814a88"`);
        await queryRunner.query(`DROP TABLE "checkout"`);
        await queryRunner.query(`DROP TYPE "public"."checkout_store_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "license"`);
    }

}
