import HttpError from './http-error';

export default class PreconditionFailedError extends HttpError {

  constructor(errorCode: number, report?: any) {
    super(412, errorCode, report);
  }

}
