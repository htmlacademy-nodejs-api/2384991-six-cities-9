import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpMethod, ValidateDTOMiddleware, DocumentExistsMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/index.js';
import { CreateCommentRequest } from './comment-request-type.js';
import { fillDTO } from '../../helpers/common.js';
import { CommentRDO } from './rdo/comment.rdo.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDTOMiddleware(CreateCommentDTO), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });
  }

  public async create({ body }: CreateCommentRequest, res: Response): Promise<void> {
    const comment = await this.commentService.create(body);
    this.created(res, fillDTO(CommentRDO, comment));
  }
}
