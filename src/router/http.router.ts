import { NextFunction, Request, Response, Router } from 'express';
import { HttpMethods } from './http.methods.enum';
import RestServer from '../rest.server';
import UserInputError from '../util/error/user.input.error';
import {EndpointResponse} from "../model/endpoint.response.model";

export default class HttpRouter {
  private readonly router = Router();

  constructor(route: string, restServer: RestServer) {
    restServer.addRouter(route, this.router);
  }

  addEndpoint(method: HttpMethods, endpoint: string, controller: (...args: any[]) => EndpointResponse<any>, params: Parameter[] = []) {
    this.router[method](endpoint, (req: Request, res: Response) => {
      const output: string[] = [];

      params.forEach(param => output.push(this.handleParameters(req, param)));

      res.send(this.handleController(controller, output));
    });
  }

  addMiddleware(func: (req: Request, res: Response, next: NextFunction) => void) {
    this.router.use(func);
  }

  private getParameterValue(req: Request, type: ParamTypes, name: string): string | undefined {
    switch (type) {
      case ParamTypes.QUERY:
        return req.query[name] as string;
      case ParamTypes.BODY:
        return req.body[name];
    }
  }

  private handleParameters(req: Request, param: Parameter): string {
    const val = this.getParameterValue(req, param.type, param.name);

    if (!val) throw new UserInputError(`Failed to parse required parameter ${param.name}`);

    this.handleGuards(val, param.guards);

    return val;
  }

  private handleGuards(val: string, guards: ((input: string) => void)[]): void {
    guards.forEach(guard => guard(val));
  }

  private handleController(controller: (...args: any[]) => EndpointResponse<any>, paramOutput: string[] = []) {
    const output = controller(...paramOutput);

    console.log(output);

    if (output.isDataRaw) {
      return output.data;
    }

    return output;
  }
}

export interface Parameter {
  type: ParamTypes;
  name: string;
  guards: ((input: string) => void)[];
}

export enum ParamTypes {
  QUERY,
  BODY
}
