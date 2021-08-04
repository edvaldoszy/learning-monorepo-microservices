import HttpError from './http-error';

export default class ForbiddenError extends HttpError {

  constructor(errorCode: number) {
    super(403, errorCode);
  }

}
