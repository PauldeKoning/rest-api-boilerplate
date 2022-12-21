import HttpError from './http.error';

export default class NotFoundError extends HttpError {
  constructor() {
    super(404, 'Resource not found');
  }
}
