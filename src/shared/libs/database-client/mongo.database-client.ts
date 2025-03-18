import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { setTimeout } from 'node:timers/promises';

import { DatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';

const RETRY_CONFIG = {
  COUNT: 5,
  TIMEOUT: 1000,
};

const MONGOOSE_READY_STATE = 1;

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  get isDatabaseConnected(): boolean {
    return this.mongoose?.connection?.readyState === MONGOOSE_READY_STATE;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isDatabaseConnected) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB…');

    let attempt = 0;
    while (attempt < RETRY_CONFIG.COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.logger.info('Database connection established.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(RETRY_CONFIG.TIMEOUT);
      }
    }

    throw new Error(`Unable to establish database connection after ${RETRY_CONFIG.COUNT}`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isDatabaseConnected) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect();
    this.logger.info('Database connection closed.');
  }
}
