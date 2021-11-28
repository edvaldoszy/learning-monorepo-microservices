import HttpError from './http-error';

class ForbiddenError extends HttpError {

  constructor(errorCode: number) {
    super(403, errorCode);
  }

}

export default ForbiddenError;
