import HttpError from './http-error';

class BadRequestError extends HttpError {

  constructor(errorCode: number, report?: any) {
    super(400, errorCode, report);
  }

}

export default BadRequestError;
