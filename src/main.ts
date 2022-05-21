// NestJS
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// Packages
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

// Modules
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Helmet
    app.use(helmet());

    // Body validation
    app.useGlobalPipes(new ValidationPipe({ transform: true }),);

    // Swagger
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
