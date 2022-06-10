import {MigrationInterface, QueryRunner} from "typeorm";

export class AddressLineTwoNotOptional1654891298897 implements MigrationInterface {
    name = 'AddressLineTwoNotOptional1654891298897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "addressLineTwo" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "addressLineTwo" DROP NOT NULL`);
    }

}
