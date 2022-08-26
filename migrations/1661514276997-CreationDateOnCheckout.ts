import {MigrationInterface, QueryRunner} from "typeorm";

export class CreationDateOnCheckout1661514276997 implements MigrationInterface {
    name = 'CreationDateOnCheckout1661514276997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkout" ADD "createdAt" TIMESTAMP DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkout" DROP COLUMN "createdAt"`);
    }

}
