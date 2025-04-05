import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ValidationErrorField, ApplicationError } from '../libs/rest/types/index.js';

export const generateRandomValue = (min:number, max: number, numAfterDigit = 0) => +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);

export const getRandomItems = <T>(items: T[]): T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

export const getExactlyNItems = <T>(items: T[], count: number): T[] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRandomItem = <T>(items: T[]): T => items[generateRandomValue(0, items.length - 1)];

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) => ({ errorType, error, details });

export const reduceValidationErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({ property, value, constraints }) => ({ property, value, messages: constraints ? Object.values(constraints) : [] }));

