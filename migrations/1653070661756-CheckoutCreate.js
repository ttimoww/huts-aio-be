const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CheckoutCreate1653070661756 {
    name = 'CheckoutCreate1653070661756'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."checkout_store_enum" AS ENUM('zalando', 'snipes', 'solebox')`);
        await queryRunner.query(`CREATE TABLE "checkout" ("checkoutId" SERIAL NOT NULL, "store" "public"."checkout_store_enum" NOT NULL, "productName" character varying NOT NULL, "productSize" character varying NOT NULL, "productImage" character varying NOT NULL, "userUserId" integer, CONSTRAINT "PK_e300b1d5c7adcd9d0c7499c8ea7" PRIMARY KEY ("checkoutId"))`);
        await queryRunner.query(`ALTER TABLE "checkout" ADD CONSTRAINT "FK_c6c247dd8e3341475f7f32df367" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "checkout" DROP CONSTRAINT "FK_c6c247dd8e3341475f7f32df367"`);
        await queryRunner.query(`DROP TABLE "checkout"`);
        await queryRunner.query(`DROP TYPE "public"."checkout_store_enum"`);
    }
}
