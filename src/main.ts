import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException({
          ok: false,
          msg: validationErrors.map((error) => (
            Object.values(error.constraints ?? {}).join(', ')
          )).toString(),
        });
      },
    })
  )
  app.enableCors()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
