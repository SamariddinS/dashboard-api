import request from 'supertest';
import { App } from '../src/app';
import { boot } from './../src/main';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'test@.uz', password: '1' });
		expect(res.statusCode).toBe(422);
	});

	it('Register - success', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'test6@mail.uz', password: '1', name: 'Samariddin' });
		expect(res.statusCode).toBe(201);
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test3@mail.uz', password: '1' });
		expect(res.statusCode).toBe(401);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test4@mail.uz', password: '1' });
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'test4@mail.uz', password: '1' });

		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('test4@mail.uz');
	});
});

afterAll(async () => {
	await application.close();
});
