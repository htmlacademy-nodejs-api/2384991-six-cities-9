import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/types/index.js';
import { LoginUserDTO } from './dto/login-user.dto.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDTO>;
