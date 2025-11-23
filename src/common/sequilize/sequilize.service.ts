import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Sequelize, Transaction } from 'sequelize';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SequelizeService implements OnModuleInit {
  public sequelize: Sequelize;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
  ) {
    const supabaseConfig = this.configService.get('supabase');
    const appDebug = this.configService.get('APP_DEBUG') === 'true';

    this.sequelize = new Sequelize({
      database: supabaseConfig.database,
      username: supabaseConfig.username,
      password: supabaseConfig.password,
      host: supabaseConfig.host,
      port: supabaseConfig.port,
      dialect: supabaseConfig.dialect,
      logging: appDebug ? (msg) => this.logger.info(msg) : false,
      pool: supabaseConfig.pool,
      dialectOptions: {},
    });
  }

  async onModuleInit() {
    try {
      await this.sequelize.authenticate();
      this.logger.info('Database connection established successfully');
    } catch (error) {
      this.logger.error('Database connection failed:', error);
    }
  }

  async query(sql: string, options?: object) {
    return this.sequelize.query(sql, options);
  }

  async select(sql: string, options?: object) {
    const results = await this.sequelize.query(sql, {
      ...options,
      type: 'SELECT',
    });

    return results.length < 2 ? results[0] : results;
  }

  async insert(sql: string, options?: object) {
    const results = await this.sequelize.query(sql, {
      ...options,
      type: 'INSERT',
    });

    return results.length < 2 ? results[0] : results;
  }

  async update(sql: string, options?: object) {
    const [results] = await this.sequelize.query(sql, {
      ...options,
      type: 'UPDATE',
    });

    return results;
  }

  async delete(sql: string, options?: object) {
    const [results] = await this.sequelize.query(sql, {
      ...options,
      type: 'DELETE',
    });
    return results;
  }

  async beginTransaction(): Promise<Transaction> {
    return this.sequelize.transaction();
  }
}
