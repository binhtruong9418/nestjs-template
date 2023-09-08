import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  ValidationPipe,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfiguration, appConfiguration } from './config/configuration';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './interceptors/exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

const configSwagger = async (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('API title')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('API tag')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};

const configValidation = async (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints[Object.keys(error.constraints)[0]],
        }));

        return new BadRequestException(result);
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: true,
    }),
  );
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig = app.get<AppConfiguration>(appConfiguration.KEY);
  const logger = new Logger('App');

  app.enableShutdownHooks();
  configSwagger(app);
  configValidation(app);

  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(appConfig.port);
  logger.log(`Application is running on port: ${appConfig.port}`);
}
bootstrap();
