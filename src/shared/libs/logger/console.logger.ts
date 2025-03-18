import { getErrorMessage } from '../../helpers/common.js';
import { Logger } from './logger.interface.js';

export class ConsoleLogger implements Logger {
  public error(message: string, error: Error, ...args: unknown[]): void {
    console.error(message, ...args);
    console.error(`Error message: ${getErrorMessage(error)}`);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(message, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    console.debug(message, ...args);
  }
}
