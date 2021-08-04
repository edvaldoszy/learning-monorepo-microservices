export default class HttpError extends Error {

  public statusCode: number;
  public errorCode: number;
  public report?: any;

  constructor(statusCode: number, errorCode: number, report?: any, message?: string) {
    super(message);

    // @ts-ignore
    Error.captureStackTrace(this, this.contructor);
    this.name = this.constructor.name;

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.report = report;
  }

}
