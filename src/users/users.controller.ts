import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import 'reflect-metadata';
import { HTTPError } from './../errors/http-error.class';

import { BaseController } from '../common/basa.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IUsers } from './users.interface';

@injectable()
export class UsersController extends BaseController implements IUsers {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
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
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
		]);
	}

	public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, 'getUsers');
	}

	public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		next(new HTTPError(401, 'Unauthorized', 'login'));
	}

	public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, 'register');
	}
}
