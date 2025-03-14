import { PinoLogger } from './shared/libs/logger/index.js';
import { RestApplication } from './rest/index.js';
import { RestConfig } from './shared/libs/config/index.js';

const bootstrap = async () => {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);

  const restApplication = new RestApplication(logger, config);
  await restApplication.init();
};

bootstrap();
