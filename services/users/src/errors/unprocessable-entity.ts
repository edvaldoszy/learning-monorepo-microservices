import HttpError from './http-error';

export default class UnprocessableEntityError extends HttpError {

  constructor(errorCode: number, report?: any) {
    super(422, errorCode, report);
  }

}
