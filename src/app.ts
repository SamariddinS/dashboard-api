import express, { Express } from 'express';
import { Server } from 'http';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import 'reflect-metadata';
import { AuthMiddleware } from './common/auth.middleware';
import { PrismaService } from './database/prisma.service';

import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
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
		@inject(TYPES.ExceptionFilters) private exceptionFilters: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(express.json());

		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
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
		this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running on port ${this.port}`);
	}

	public async close(): Promise<void> {
		this.prismaService.disconnect();
		this.server.close();
	}
}
