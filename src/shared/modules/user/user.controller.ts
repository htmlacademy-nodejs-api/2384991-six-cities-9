import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateDTOMiddleware,
  ValidateObjectIdMiddleware,
  UploadFileMiddleware,
  PrivateRouteMiddleware,
  DocumentExistsMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { OfferService } from '../offer/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { LoginUserDTO } from './dto/login-user.dto.js';
import { AuthService } from '../auth/auth-service.interface.js';
import { LoggedUserRDO } from './rdo/logger-user.rdo.js';
import { OfferRDO } from '../offer/index.js';
import { ParamOfferId } from '../offer/type/param-offerid.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.register,
      middlewares: [new ValidateDTOMiddleware(CreateUserDTO)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDTOMiddleware(LoginUserDTO)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [new ValidateObjectIdMiddleware('userId'), new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),]
    });
    this.addRoute({
      path: '/me/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/me/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.addToFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/me/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async register({ body }: CreateUserRequest, res: Response): Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRDO, {
      email: user.email,
      token
    });

    this.ok(res, responseData);
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    this.created(res, { filepath: req.file?.path });
  }

  public async checkAuthenticate({ tokenPayload: { email} }: Request, res: Response): Promise<void> {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(UserRdo, foundedUser));
  }

  public async getFavorites({ tokenPayload }: Request, res: Response): Promise<void> {
    const favorites = await this.userService.findFavorites(tokenPayload.id);

    const offersWithFlag = favorites.map((offer) => ({
      ...offer.toObject(),
      isFavorite: true
    }));

    this.ok(res, fillDTO(OfferRDO, offersWithFlag));
  }

  public async addToFavorites({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const result = await this.userService.addFavorite(tokenPayload.id, offerId);

    this.noContent(res, result);
  }

  public async removeFromFavorites({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const result = await this.userService.removeFavorite(tokenPayload.id, offerId);

    this.noContent(res, result);
  }
}
