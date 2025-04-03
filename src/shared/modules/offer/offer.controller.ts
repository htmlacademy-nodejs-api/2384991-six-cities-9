import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateObjectIdMiddleware,
  ValidateDTOMiddleware,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { ParamOfferId, ParamCity } from './type/index.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRDO } from './rdo/offer.rdo.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { CommentRDO } from '../comment/rdo/comment.rdo.js';
import { CommentService } from '../comment/index.js';
import { UserService } from '../user/user-service.interface.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateOfferDTO)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getCommentsForOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')],
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.findPremiumByCity });
  }

  public async index({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findOfferList();
    const userId = tokenPayload?.id;

    let favoriteOfferIds: Set<string> = new Set();

    if (userId) {
      const favorites = await this.userService.findFavorites(userId);
      favoriteOfferIds = new Set(favorites.map((offer) => offer.id.toString()));
    }

    const offersWithFavorites = offers.map((offer) => ({
      ...offer.toObject(),
      isFavorite: favoriteOfferIds.has(offer.id.toString())
    }));

    this.ok(res, fillDTO(OfferRDO, offersWithFavorites));
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const existOffer = await this.offerService.findDuplicate({...body, userId: tokenPayload.id});

    if (existOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer with name ${body.offerName} already exists in this city.`,
        'OfferController'
      );
    }

    const result = await this.offerService.create({...body, userId: tokenPayload.id});
    this.created(res, fillDTO(OfferRDO, result));
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(OfferRDO, offer));
  }

  public async update({ params, body }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const updatedOffer = await this.offerService.updateById(offerId, body);

    this.ok(res, fillDTO(OfferRDO, updatedOffer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    this.noContent(res, offer);
  }

  public async findPremiumByCity({ params }: Request<ParamCity>, res: Response): Promise<void> {
    const { city } = params;

    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City is required.',
        'OfferController'
      );
    }

    const offers = await this.offerService.findPremiumByCity(city);
    this.ok(res, fillDTO(OfferRDO, offers));
  }

  public async getCommentsForOffer({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;

    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentRDO, comments));
  }
}
