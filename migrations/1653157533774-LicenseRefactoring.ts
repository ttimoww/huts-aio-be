import { MigrationInterface, QueryRunner } from 'typeorm';

export class LicenseRefactoring1653157533774 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "license" RENAME COLUMN "plan" TO "planId"');
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "license" RENAME COLUMN "planId" TO "plan"');
    }

}
