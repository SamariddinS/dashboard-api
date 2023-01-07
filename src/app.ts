// import { json } from 'body-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import 'reflect-metadata';

import { ExceptionFilters } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UsersController } from './users/users.controller';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UsersController) private usersController: UsersController,
		@inject(TYPES.ExceptionFilters) private exceptionFilters: ExceptionFilters,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(express.json());
	}
	useRouter(): void {
		this.app.use('/users', this.usersController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilters.catch.bind(this.exceptionFilters));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRouter();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running on port ${this.port}`);
	}
}
