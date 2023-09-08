import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfiguration, appConfiguration } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [appConfiguration.KEY],
      useFactory: (appConfig: AppConfiguration) => ({
        type: 'mysql',
        host: appConfig.db.host,
        port: appConfig.db.port,
        username: appConfig.db.username,
        password: '',
        database: appConfig.db.database,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
