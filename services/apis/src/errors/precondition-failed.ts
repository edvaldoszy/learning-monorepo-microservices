import HttpError from './http-error';

class PreconditionFailedError extends HttpError {

  constructor(errorCode: number, report?: any) {
    super(412, errorCode, report);
  }

}

export default PreconditionFailedError;
