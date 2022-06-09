import {MigrationInterface, QueryRunner} from "typeorm";

export class ProfilesDDL1654806936625 implements MigrationInterface {
    name = 'ProfilesDDL1654806936625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("profileId" SERIAL NOT NULL, "profileName" character varying NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "addressLineOne" character varying NOT NULL, "addressLineTwo" character varying, "houseNumber" character varying NOT NULL, "city" character varying NOT NULL, "province" character varying NOT NULL, "postalCode" character varying NOT NULL, "phone" character varying NOT NULL, "country" character varying NOT NULL, "userUserId" integer, CONSTRAINT "PK_61a193410d652adedb69f7ad680" PRIMARY KEY ("profileId"))`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_c645941c0a12a9e9934026e0189" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_c645941c0a12a9e9934026e0189"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
