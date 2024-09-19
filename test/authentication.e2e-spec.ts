import {
  inputLoginUser,
  inputRegisterUser,
  unprocessableLoginUser,
  unprocessableRegisterUser,
} from './authentication.e2e.config';

import { validationPipeOptions } from '@ab/core/app-bootstrap.util';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { AppModule } from '../src/app.module';

describe('The api/authentication endpoint', () => {
  let app: INestApplication;
  let http: TestAgent;
  // Arrange Endpoints
  const authenticationEndPoint: string = '/api/authentication';
  // Arrange Setup
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
    await app.init();
    http = request(app.getHttpServer());
  });

  describe('GET  /ping', () => {
    it('should return pong', async () => {
      // Arrange
      const pingUrl = `${authenticationEndPoint}/ping`;
      // Act & Assert
      await http.get(pingUrl).expect(200).expect('pong');
    });
  });

  describe('POST /register', () => {
    it('should return 201 for valid input', async () => {
      // Act & Assert
      await http
        .post(`${authenticationEndPoint}/register`)
        .send(inputRegisterUser)
        .expect(201);
    });
    it('should return 422 for unprocessable entity', async () => {
      // Act & Assert
      await http
        .post(`${authenticationEndPoint}/register`)
        .send(unprocessableRegisterUser)
        .expect(422);
    });
  });

  describe('POST /login', () => {
    it('should return 200 for valid input', async () => {
      // Act & Assert
      await http
        .post(`${authenticationEndPoint}/login`)
        .send(inputLoginUser)
        .expect(200);
    });
    it('should return 422 for unprocessable entity', async () => {
      // Act & Assert
      await http
        .post(`${authenticationEndPoint}/login`)
        .send(unprocessableLoginUser)
        .expect(422);
    });
  });
});
