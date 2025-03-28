import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory, NestApplication } from "@nestjs/core";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "@/app.module";
import { config } from "dotenv";
config();

async function bootstrap() {
    const context = "NestApplication";
    const logger = new Logger(context);
    const app: NestApplication = await NestFactory.create(AppModule);

    app.enableCors();
    app.setGlobalPrefix("api/v1");

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );

    setupOpenAPI(app);

    const port = process.env.APPLICATION_PORT ?? 3000;
    await app.listen(port);

    logger.log(`Application is running on: ${await app.getUrl()}`);
    logger.debug(`Database running on ${process.env.DB_HOST}/${process.env.DB_NAME}`);
}
void bootstrap();

function setupOpenAPI(app: NestApplication) {
    const config = new DocumentBuilder()
        .setTitle("API з повною аутентифікацією")
        .setDescription("Документація API, що включає реєстрацію, авторизацію, оновлення токену та управління користувачами.")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [],
    });

    const options: SwaggerCustomOptions = {
        swaggerOptions: {
            filter: true,
            showRequestDuration: true,
        },
    };

    SwaggerModule.setup("api-docs", app, document, options);
}
