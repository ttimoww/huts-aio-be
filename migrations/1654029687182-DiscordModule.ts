import {MigrationInterface, QueryRunner} from "typeorm";

export class DiscordModule1654029687182 implements MigrationInterface {
    name = 'DiscordModule1654029687182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "webhook" ("webhookId" SERIAL NOT NULL, "url" character varying NOT NULL, "userUserId" integer, CONSTRAINT "REL_4876ce005c1a4cbede6a03da84" UNIQUE ("userUserId"), CONSTRAINT "PK_dcbf87ac6301b362a0ada11203e" PRIMARY KEY ("webhookId"))`);
        await queryRunner.query(`ALTER TABLE "checkout" ADD "productPrice" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "webhook" ADD CONSTRAINT "FK_4876ce005c1a4cbede6a03da844" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "webhook" DROP CONSTRAINT "FK_4876ce005c1a4cbede6a03da844"`);
        await queryRunner.query(`ALTER TABLE "checkout" DROP COLUMN "productPrice"`);
        await queryRunner.query(`DROP TABLE "webhook"`);
    }

}
