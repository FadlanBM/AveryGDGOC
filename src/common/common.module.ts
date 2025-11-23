import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ValidationService } from './validation.service';
import { HelperService } from './helper/helper.service';
import * as winston from 'winston';
import moment from 'moment-timezone';
import { ErrorFilter } from './error.filter';
import databaseConfig from './config/database.config';
import supabaseConfig from './config/supabase.config';
import jwtConfig from './config/jwt.config';
import { SequelizeService } from './sequilize/sequilize.service';
import { QueryService } from './sequilize/query.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: 'logs/errors.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp({
              format: () =>
                moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
            }),
            winston.format.printf(({ timestamp, level, message }) => {
              return `[${timestamp}] [${level}] ${message}`;
            }),
          ),
        }),

        new winston.transports.File({
          filename: 'logs/app.log',
          level: 'debug',
          format: winston.format.combine(
            winston.format.timestamp({
              format: () =>
                moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
            }),
            winston.format.ms(),
            winston.format((info) => {
              return info.level == 'error' ? false : info;
            })(),
            winston.format.printf(({ timestamp, level, message, ms }) => {
              return `[${timestamp}] [${level}] ${message} ${ms ? `[${ms}]` : ''}`;
            }),
          ),
        }),
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, supabaseConfig, jwtConfig],
    }),
    HttpModule,
  ],
  providers: [
    ValidationService,
    SequelizeService,
    HelperService,
    QueryService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [ValidationService, SequelizeService, HelperService, QueryService],
})
export class CommonModule {}
