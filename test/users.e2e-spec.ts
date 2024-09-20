import {
  inputLoginUser,
  inputRegisterUser,
  unauthorizedLoginPassword,
  unauthorizedLoginUser,
  unprocessableLoginUser,
  unprocessableRegisterUser,
} from './users.e2e.config';

import { validationPipeOptions } from '@ab/core/app-bootstrap.util';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { AppModule } from '../src/app.module';

describe('/api/users', () => {
  let app: INestApplication;
  let http: TestAgent;
  // Arrange Endpoints
  const usersUrl: string = '/api/users';
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
      const pingUrl = `${usersUrl}/ping`;
      // Act & Assert
      await http.get(pingUrl).expect(200).expect('pong');
    });
  });

  describe('POST /register', () => {
    beforeEach(async () => {
      // Arrange : clean up the state before each test
      await http.delete(`${usersUrl}/`).send(inputRegisterUser);
    });
    it('should return 201 for valid input', async () => {
      // Act & Assert
      await http.post(`${usersUrl}/register`).send(inputRegisterUser).expect(201);
    });
    it('should return 422 for unprocessable entity', async () => {
      // Act & Assert
      await http.post(`${usersUrl}/register`).send(unprocessableRegisterUser).expect(422);
    });
    it('should return 409 for duplicate user', async () => {
      // Arrange : force the creation of a user
      await http.post(`${usersUrl}/register`).send(inputRegisterUser).expect(201);
      // Act & Assert
      await http.post(`${usersUrl}/register`).send(inputRegisterUser).expect(409);
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      // Arrange : clean up the state before each test
      await http.delete(`${usersUrl}/`).send(inputRegisterUser);
    });
    it('should return 200 for valid input', async () => {
      // Arrange : force the creation of a user
      await http.post(`${usersUrl}/register`).send(inputRegisterUser).expect(201);
      // Act & Assert
      await http.post(`${usersUrl}/login`).send(inputLoginUser).expect(200);
    });
    it('should return 422 for unprocessable entity', async () => {
      // Act & Assert
      await http.post(`${usersUrl}/login`).send(unprocessableLoginUser).expect(422);
    });
    it('should return 401 for unauthorized email', async () => {
      // Act & Assert
      await http.post(`${usersUrl}/login`).send(unauthorizedLoginUser).expect(401);
    });
    it('should return 401 for unauthorized password', async () => {
      // Arrange
      await http.post(`${usersUrl}/register`).send(inputRegisterUser).expect(201);
      // Act & Assert
      await http.post(`${usersUrl}/login`).send(unauthorizedLoginPassword).expect(401);
    });
    // should return a token
    it('should return a token', async () => {
      // Arrange
      await http.post(`${usersUrl}/register`).send(inputRegisterUser).expect(201);
      // Act & Assert
      await http
        .post(`${usersUrl}/login`)
        .send(inputLoginUser)
        .expect(200)
        .expect((response) => {
          expect(response.body.token).toBeDefined();
          expect(response.body.token.length).toBeGreaterThan(64);
        });
    });
  });
});
