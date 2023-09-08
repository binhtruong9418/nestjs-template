import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => {
  return {
    port: parseInt(process.env.PORT, 10) || 80,
    db: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'test',
    },
  };
});

export type AppConfiguration = ConfigType<typeof appConfiguration>;
export const InjectAppConfig = () => Inject(appConfiguration.KEY);
