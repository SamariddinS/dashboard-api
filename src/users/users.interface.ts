import { NextFunction, Request, Response } from 'express';

export interface IUsers {
	getUsers: (req: Request, res: Response, next: NextFunction) => void;
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
