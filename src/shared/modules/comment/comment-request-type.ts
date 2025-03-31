import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../shared/libs/rest/index.js';
import { CreateCommentDTO } from './index.js';

export type CreateCommentRequest = Request<RequestParams, RequestBody, CreateCommentDTO>;
