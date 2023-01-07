import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import 'reflect-metadata';

import { ILogger } from './../logger/logger.interface';
import { TYPES } from './../types';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';

@injectable()
export class ExceptionFilters implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch = (err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void => {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Error: ${err.statusCode} : ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`Error: ${err.message}`);
			res.status(500).send({ err: err.message });
		}
	};
}
