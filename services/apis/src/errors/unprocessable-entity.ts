import HttpError from './http-error';

class UnprocessableEntityError extends HttpError {

  constructor(errorCode: number, report?: any) {
    super(422, errorCode, report);
  }

}

export default UnprocessableEntityError;
