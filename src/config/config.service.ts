import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from './../logger/logger.interface';
import { TYPES } from './../types';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error('Error loading .env file');
		} else {
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
