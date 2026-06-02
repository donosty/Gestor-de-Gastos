class HttpError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message);

    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = options.code;
    this.details = options.details;

    Error.captureStackTrace(this, HttpError);
  }
}

export { HttpError };