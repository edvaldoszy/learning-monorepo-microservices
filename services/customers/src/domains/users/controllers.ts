import { Request, Response } from '@tinyhttp/app';

async function find(_: Request, response: Response) {
  response
    .json([]);
}

export default {
  find,
};
