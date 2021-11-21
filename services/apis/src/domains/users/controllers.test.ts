import faker from 'faker';
import { createServer } from 'http';
import supertest from 'supertest';

import app from '~/app';
import knex from '~/factories/knex';
import { generateHash } from '~/helpers/bcrypt';

const request = supertest(createServer().on('request', app.attach));

describe('users controllers', () => {
  describe('POST /api/users/login', () => {
    it('should authenticate with given email and passowrd', async () => {
      const name = faker.name.firstName();
      const email = faker.internet.email();
      const password = '123456';

      const [userId] = await knex('users')
        .insert({
          name,
          email,
          password: generateHash(password),
        });

      const response = await request.post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email, password });

      expect(response.statusCode)
        .toBe(200);
      expect(typeof response.body.token)
        .toBe('string');
      expect(response.body.user.id)
        .toEqual(userId);
    });
  });
});
