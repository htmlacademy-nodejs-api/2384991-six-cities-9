import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateObjectIdMiddleware,
  ValidateDTOMiddleware,
  DocumentExistsMiddleware
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
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDTOMiddleware(CreateOfferDTO)]
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
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new ValidateDTOMiddleware(UpdateOfferDTO), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getCommentsForOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')],
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.findPremiumByCity });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findOfferList();
    this.ok(res, fillDTO(OfferRDO, offers));
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const existOffer = await this.offerService.findDuplicate(body);

    if (existOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer with name ${body.offerName} already exists in this city.`,
        'OfferController'
      );
    }

    const result = await this.offerService.create(body);
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
