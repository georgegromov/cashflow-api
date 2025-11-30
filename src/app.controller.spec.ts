import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppController } from './app.controller';
import { Server } from 'http';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    server = app.getHttpServer() as Server;
  });

  it('GET / should return status', async () => {
    await request(server).get('/').expect(200).expect({ status: 'available' });
  });

  afterAll(async () => {
    await app.close();
  });
});
