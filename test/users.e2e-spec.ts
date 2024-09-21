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
  const usersUrl: string = '/api/users';

  // Arrange Setup
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .setLogger(console)
      .compile();
    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
    await app.init();
    http = request(app.getHttpServer());
  });

  async function cleanupUsers() {
    let token;
    let tryGetToken = await http.post(`${usersUrl}/register`).send(inputRegisterUser);
    token = tryGetToken.body.token;
    if (!token) {
      tryGetToken = await http.post(`${usersUrl}/login`).send(inputLoginUser);
      token = tryGetToken.body.token;
    }
    await http
      .delete(`${usersUrl}/`)
      .set('X-API-Key', 'secret')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);
  }

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
      await cleanupUsers();
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
      await cleanupUsers();
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

  describe('DELETE /', () => {
    beforeEach(async () => {
      await cleanupUsers();
    });
    it('should return 200 for valid request and authenticated user', async () => {
      // Arrange
      const inputResponse = await http
        .post(`${usersUrl}/register`)
        .send(inputRegisterUser)
        .expect(201);
      // Act & Assert
      await http
        .delete(`${usersUrl}/`)
        .set('X-API-Key', 'secret')
        .set('Authorization', `Bearer ${inputResponse.body.token}`)
        .send()
        .expect(200);
    });
    it('should return 401 for Unauthorized user', async () => {
      // Act & Assert
      await http
        .delete(`${usersUrl}/`)
        .set('X-API-Key', 'secret')
        .send()
        .expect(401)
        .expect((response) => {
          expect(response.body.message).toBe('No token provided');
        });
    });
    it('should return 401 for invalid token', async () => {
      // Act & Assert
      await http
        .delete(`${usersUrl}/`)
        .set('X-API-Key', 'secret')
        .set('Authorization', `Bearer invalid`)
        .send()
        .expect(401)
        .expect((response) => {
          expect(response.body.message).toBe('Invalid token');
        });
    });
    it('should return 401 for No api key', async () => {
      // Arrange
      const inputResponse = await http
        .post(`${usersUrl}/register`)
        .send(inputRegisterUser)
        .expect(201);
      // Act & Assert
      await http
        .delete(`${usersUrl}/`)
        .set('Authorization', `Bearer ${inputResponse.body.token}`)
        .send()
        .expect(401)
        .expect((response) => {
          expect(response.body.message).toBe('API Key is missing');
        });
    });
  });
});
