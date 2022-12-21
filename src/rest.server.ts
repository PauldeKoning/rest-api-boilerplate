import { singleton } from 'tsyringe';
import express, { NextFunction, Request, Response, Router } from 'express';
import HttpError from './util/error/http.error';

@singleton()
export default class RestServer {
  private readonly port = 3000;
  private readonly app = express();

  constructor() {
    this.app.use(express.json());
    this.app.listen(this.port, () => this.listen());
  }

  private listen(): void {
    console.log('Server started on port', this.port);
  }

  addRouter(route: string, router: Router): void {
    this.app.use(route, router);
  }

  addErrorHandler(func: (err: HttpError, req: Request, res: Response, next: NextFunction) => void): void {
    this.app.use(func);
  }

  addGlobalMiddleware(func: (req: Request, res: Response, next: NextFunction) => void): void {
    this.app.use(func);
  }
}
