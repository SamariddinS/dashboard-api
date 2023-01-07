import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';

import { ContainerModule } from 'inversify/lib/container/container_module';
import { App } from './app';
import { ExceptionFilters } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UsersController } from './users/users.controller';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<UsersController>(TYPES.UsersController).to(UsersController);
	bind<IExceptionFilter>(TYPES.ExceptionFilters).to(ExceptionFilters);
	bind(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
