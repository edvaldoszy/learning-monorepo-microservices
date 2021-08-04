import HttpError from './http-error';

export default class UnauthorizedError extends HttpError {

  constructor(errorCode: number) {
    super(401, errorCode);
  }

}
