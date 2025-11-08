/* eslint-disable @typescript-eslint/no-floating-promises */
import { DataSource } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';

const isTestEnvironment = (): boolean => {
  return process.env.NODE_ENV === 'test';
};

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isTest = isTestEnvironment();

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASS'),
    database: isTest
      ? configService.get<string>('DB_TEST_NAME')
      : configService.get<string>('DB_NAME'),
    autoLoadEntities: true,
    synchronize: isTest,
    migrationsRun: !isTest,
    dropSchema: isTest,
  };
};

ConfigModule.forRoot({
  isGlobal: true,
});
const cliConfigService = new ConfigService();
const isCliTest = isTestEnvironment();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: cliConfigService.get<string>('DB_HOST'),
  port: parseInt(cliConfigService.get<string>('DB_PORT') || '5432', 10),
  username: cliConfigService.get<string>('DB_USER'),
  password: cliConfigService.get<string>('DB_PASS'),
  database: isCliTest
    ? cliConfigService.get<string>('DB_TEST_NAME')
    : cliConfigService.get<string>('DB_NAME'),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: isCliTest ? false : true,
});
