import {
  inputLoginUser,
  inputRegisterUser,
  unauthorizedLoginPassword,
  unauthorizedLoginUser,
  unprocessableLoginUser,
  unprocessableRegisterUser,
} from './users.e2e.config';

import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';

describe('/api/users', () => {
  const usersUrl: string = 'http://localhost:3000/api/users';
  let http: TestAgent;

  // Arrange Setup
  beforeEach(async () => {
    http = request.agent(usersUrl);
    await cleanupDbUsers();
  });

  afterEach(async () => {});

  /**
   * Cleans up the database by deleting all users
   * Should be executed before each test to ensure a clean state
   */
  async function cleanupDbUsers() {
    const loginResponse = await http.post(`/login`).send(inputLoginUser);
    const token = loginResponse.body.token;
    if (!token) {
      return;
    }
    await http
      .delete(`/`)
      .set('X-API-Key', 'secret')
      .set('Authorization', `Bearer ${token}`)
      .send();
  }

  describe('GET /ping', () => {
    it('should return pong', async () => {
      // Arrange
      const pingUrl = `/ping`;
      // Act & Assert
      await http.get(pingUrl).expect(200).expect('pong');
    });
  });

  describe('POST /register', () => {
    beforeEach(async () => {
      await cleanupDbUsers();
    });
    it('should return 201 for valid input', async () => {
      // Act & Assert
      await http.post(`/register`).send(inputRegisterUser).expect(201);
    });
    it('should return 422 for unprocessable entity', async () => {
      // Act & Assert that response is 422 for unprocessable entity
      await http.post(`/register`).send(unprocessableRegisterUser).expect(422);
    });
    it('should return 409 for duplicate user', async () => {
      // Arrange : force the creation of a user
      await http.post(`/register`).send(inputRegisterUser).expect(201);
      // Act & Assert that response is 409 for duplicate user
      await http.post(`/register`).send(inputRegisterUser).expect(409);
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await cleanupDbUsers();
    });

    it('should return 200 and a user token for valid input', async () => {
      // Arrange : force the creation of a user
      await http.post(`/register`).send(inputRegisterUser).expect(201);
      // Act & Assert that response is 200 with a token and a user for valid input
      await http
        .post(`/login`)
        .send(inputLoginUser)
        .expect(200)
        .expect((response) => {
          expect(response.body.token).toBeDefined();
          expect(response.body.user).toBeDefined();
        });
    });
    it('should return 422 for unprocessable entity', async () => {
      // Act & Assert that response is 422 for unprocessable entity
      await http.post(`/login`).send(unprocessableLoginUser).expect(422);
    });
    it('should return 401 for unauthorized email', async () => {
      // Act & Assert that response is 401 for unauthorized email
      await http.post(`/login`).send(unauthorizedLoginUser).expect(401);
    });
    it('should return 401 for unauthorized password', async () => {
      // Arrange : force the creation of a user
      await http.post(`/register`).send(inputRegisterUser).expect(201);
      // Act & Assert that response is 401 for unauthorized password
      await http.post(`/login`).send(unauthorizedLoginPassword).expect(401);
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await cleanupDbUsers();
    });
    it('should return 200 for valid request and authenticated user', async () => {
      // Arrange : force the creation of a user
      const inputResponse = await http.post(`/register`).send(inputRegisterUser).expect(201);
      // Act & Assert that response is 200 for valid request and authenticated user
      await http
        .delete(`/`)
        .set('X-API-Key', 'secret')
        .set('Authorization', `Bearer ${inputResponse.body.token}`)
        .send()
        .expect(200);
    });
    it('should return 401 for Unauthorized user', async () => {
      // Act & Assert that response is 401 for unauthorized user
      await http
        .delete(`/`)
        .set('X-API-Key', 'secret')
        .send()
        .expect(401)
        .expect((response) => {
          expect(response.body.message).toBe('No token provided');
        });
    });
    it('should return 401 for invalid token', async () => {
      // Act & Assert that response is 401 for invalid token
      await http
        .delete(`/`)
        .set('X-API-Key', 'secret')
        .set('Authorization', `Bearer invalid`)
        .send()
        .expect(401)
        .expect((response) => {
          expect(response.body.message).toBe('jwt malformed');
        });
    });
    it.skip('should return 401 for expired token', async () => {
      // Change the JWT_EXPIRES_IN to 1 second to make the test fail
      // Skip otherwise
      // Arrange: wait 3 seconds to let the token expire
      const inputResponse = await http.post(`/register`).send(inputRegisterUser).expect(201);
      const token = inputResponse.body.token;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // Act & Assert that response is 401 for expired token
      await http
        .delete(`/`)
        .set('X-API-Key', 'secret')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(401)
        .expect((response) => {
          expect(response.body.message).toBe('jwt expired');
        });
    });
    it('should return 403 for No api key', async () => {
      // Arrange
      const inputResponse = await http.post(`/register`).send(inputRegisterUser).expect(201);
      const token = inputResponse.body.token;
      // Act & Assert
      await http
        .delete(`/`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(403)
        .expect((response) => {
          expect(response.body.message).toBe('x-api-key is missing in the header');
        });
    });
  });

  describe('GET /api/users/:id', () => {
    beforeEach(async () => {
      await cleanupDbUsers();
    });
    it('should return user details', async () => {
      // Arrange
      const inputResponse = await http.post(`/register`).send(inputRegisterUser);
      const inputId = inputResponse.body.user.id;
      const token = inputResponse.body.token;
      // Act & Assert
      const response = await http
        .get(`/${inputId}`)
        .set('X-API-Key', 'secret')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(response.body.id).toBe(inputId);
    });

    it('should return 404 if user not found', async () => {
      const inputId = 'nonexistent-id';
      const response = await http.get(`/${inputId}`).set('X-API-Key', 'secret').expect(404);

      expect(response.body.message).toBe(`User not found: ${inputId}`);
    });
  });
});
