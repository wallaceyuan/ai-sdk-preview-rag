"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./http-exception.filter");
const response_1 = require("./response");
async function bootstrap(port) {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter({
        bodyLimit: 50 * 1048576
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new response_1.ResponseInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    try {
        await app.listen(port, '0.0.0.0');
        console.log(`Application is running on: ${await app.getUrl()}`);
    }
    catch (error) {
        if (error.code === 'EADDRINUSE') {
            console.warn(`Port ${port} is already in use, trying next port...`);
            await bootstrap(port + 1);
        }
        else {
            console.error(`Failed to start application: ${error.message}`);
            process.exit(1);
        }
    }
}
bootstrap(3000);
//# sourceMappingURL=main.js.map