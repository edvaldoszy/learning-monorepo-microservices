import HttpError from './http-error';

class UnauthorizedError extends HttpError {

  constructor(errorCode: number) {
    super(401, errorCode);
  }

}

export default UnauthorizedError;
