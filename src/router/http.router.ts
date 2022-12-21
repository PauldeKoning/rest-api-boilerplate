import {NextFunction, Request, Response, Router} from "express";
import {HttpMethods} from "./http.methods.enum";
import RestServer from "../rest.server";
import UserInputError from "../util/error/user.input.error";

export default class HttpRouter {

    private readonly router = Router();

    constructor(route: string, restServer: RestServer) {
        restServer.addRouter(route, this.router);
    }

    addEndpoint(method: HttpMethods,
                endpoint: string,
                func: Function,
                params: Parameter[] = []) {
        this.router[method](endpoint, (req: Request, res: Response) => {
            if (params.length === 0) {
                return res.send(func());
            }

            const output: string[] = [];

            params.forEach(param => output.push(this.handleParameters(req, param)));

            res.send(func(...output));
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

        if (!val)
            throw new UserInputError(`Failed to parse required parameter ${param.name}`);

        this.handleGuards(val, param.guards)

        return val;
    }

    private handleGuards(val: string, guards: [Function, ...any][]) {
        guards.forEach(guard => {
            guard[0](val, ...guard.slice(1));
        });
    }
}

export interface Parameter {
    type: ParamTypes,
    name: string,
    guards: [Function, ...any][]
}

export enum ParamTypes {
    QUERY,
    BODY
}