import { Request, Response } from '@tinyhttp/app';

import HttpError from '~/errors/http-error';
import errorCodes from '~/resources/error-codes';

export default function errorMiddleware(err: any, _request: Request, response: Response) {
  console.warn(err);

  if (err instanceof HttpError) {
    const { errorCode } = err;
    const errorMessage = err.message || errorCodes[errorCode];

    response
      .status(err.statusCode)
      .json({
        error: {
          code: errorCode,
          message: errorMessage,
          report: err.report,
        },
      });
    return;

  }

  response
    .status(500)
    .json({
      error: {
        code: 0,
        message: 'Internal Server Error',
      },
    });
}
