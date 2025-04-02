import { inject, injectable } from 'inversify';
import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';
import { AuthService } from './auth-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { LoginUserDTO, UserEntity, UserService } from '../user/index.js';
import { TokenPayload } from './types/TokenPayload.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { UserNotFoundException, UserPasswordIncorrectException } from './errors/index.js';

const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRED = '2d';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      email: user.email,
      name: user.name,
      userType: user.userType,
      id: user.id
    };

    this.logger.info(`Create token for user: ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with email ${dto.email} not found.`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for user with email ${dto.email}.`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
