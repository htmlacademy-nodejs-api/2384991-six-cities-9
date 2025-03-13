import { PinoLogger } from "./shared/libs/logger/index.js";
import { RestApplication } from "./rest/index.js";

const bootstrap = async () => {
  const logger = new PinoLogger();

  const restApplication = new RestApplication(logger);
  await restApplication.init();
};

bootstrap();