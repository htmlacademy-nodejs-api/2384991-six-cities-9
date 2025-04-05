import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import * as crypto from 'node:crypto';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = crypto.randomUUID();
        callback(null, `${filename}.${fileExtension}`);
      }
    });

    const fileFilter = (_req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        return callback(null, true);
      } else {
        return callback(
          new HttpError(
            StatusCodes.BAD_REQUEST,
            'Invalid file type. Only image files are allowed.',
            'UploadFileMiddleware'
          )
        );
      }
    };

    const uploadSingleFileMiddleware = multer({ storage, fileFilter }).single(this.fieldName);
    uploadSingleFileMiddleware(req, res, next);
  }
}
