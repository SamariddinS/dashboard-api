import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (typeof payload !== 'string' && payload !== undefined) {
					req.user = payload.email;
					next();
				} else {
					next();
				}
			});
		}
		next();
	}
}
