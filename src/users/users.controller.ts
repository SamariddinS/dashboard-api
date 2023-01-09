import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import 'reflect-metadata';
import { ValidateMiddleware } from './../common/validate.middleware';
import { HTTPError } from './../errors/http-error.class';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './user.service';

import { BaseController } from '../common/basa.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IUsers } from './users.interface';

@injectable()
export class UsersController extends BaseController implements IUsers {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.getUsers,
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	getUsers(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'getUsers');
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);

		if (!result) {
			return next(new HTTPError(401, 'Login or password incorrect', 'login'));
		}

		this.ok(res, { login: 'success' });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (!result) {
			return next(new HTTPError(422, 'User is exist', 'register'));
		}

		this.ok(res, { email: result.email, id: result.id });
	}
}
