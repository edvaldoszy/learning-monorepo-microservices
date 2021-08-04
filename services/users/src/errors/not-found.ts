import HttpError from './http-error';

export default class NotFoundError extends HttpError {

  constructor(errorCode: number) {
    super(404, errorCode);
  }

}
