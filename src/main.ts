// NestJS
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// Packages
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

// Modules
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Setup validation.
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    // Setup Swagger Docs
    if (process.env.NODE_ENV === 'development'){
        const config = new DocumentBuilder()
            .addBearerAuth()
            .setTitle('HutsAIO Back End')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
    }

    await app.listen(+process.env.PORT);
}

bootstrap();
