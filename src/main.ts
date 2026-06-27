import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './modules/auth/auth.service';
import { GeographySeedService } from './modules/geography/geography-seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const authService = app.get(AuthService);
  await authService.seedDefaults();

  const geoSeed = app.get(GeographySeedService);
  await geoSeed.seed();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
