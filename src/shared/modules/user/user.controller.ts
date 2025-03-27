import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { CreateUserRequest } from './create-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService
  ) {
    super(logger);

    this.logger.info('Register routes for UserController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/create', method: HttpMethod.Post, handler: this.create });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const email = req.query.email as string;
    const users = await this.userService.findByEmail(email);
    this.ok(res, users);
  }

  public async create(_req: CreateUserRequest, _res: Response, _next: NextFunction): Promise<void> {
    throw new Error('[UserController] Oops');
  }
}
