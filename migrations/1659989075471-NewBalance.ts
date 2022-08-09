import {MigrationInterface, QueryRunner} from "typeorm";

export class NewBalance1659989075471 implements MigrationInterface {
    name = 'NewBalance1659989075471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."checkout_store_enum" RENAME TO "checkout_store_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."checkout_store_enum" AS ENUM('zalando', 'snipes', 'solebox', 'lvr', 'kith', 'supreme', 'New Balance')`);
        await queryRunner.query(`ALTER TABLE "checkout" ALTER COLUMN "store" TYPE "public"."checkout_store_enum" USING "store"::"text"::"public"."checkout_store_enum"`);
        await queryRunner.query(`DROP TYPE "public"."checkout_store_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."log_store_enum" RENAME TO "log_store_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."log_store_enum" AS ENUM('zalando', 'snipes', 'solebox', 'lvr', 'kith', 'supreme', 'New Balance')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "store" TYPE "public"."log_store_enum" USING "store"::"text"::"public"."log_store_enum"`);
        await queryRunner.query(`DROP TYPE "public"."log_store_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."log_store_enum_old" AS ENUM('zalando', 'snipes', 'solebox', 'lvr', 'kith', 'supreme')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "store" TYPE "public"."log_store_enum_old" USING "store"::"text"::"public"."log_store_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."log_store_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."log_store_enum_old" RENAME TO "log_store_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."checkout_store_enum_old" AS ENUM('zalando', 'snipes', 'solebox', 'lvr', 'kith', 'supreme')`);
        await queryRunner.query(`ALTER TABLE "checkout" ALTER COLUMN "store" TYPE "public"."checkout_store_enum_old" USING "store"::"text"::"public"."checkout_store_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."checkout_store_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."checkout_store_enum_old" RENAME TO "checkout_store_enum"`);
    }

}
