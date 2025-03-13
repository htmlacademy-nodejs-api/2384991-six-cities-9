import { Logger } from '../shared/libs/logger/index.js';

export class RESTApplication {
  constructor(private readonly logger: Logger) {}

  public async init() {
    this.logger.info('REST Application initialized');
  }
}