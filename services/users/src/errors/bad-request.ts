import HttpError from './http-error';

export default class BadRequestError extends HttpError {

  constructor(errorCode: number, report?: any) {
    super(400, errorCode, report);
  }

}
