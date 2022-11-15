import {NextFunction, Request, Response, Router} from "express";
import {HttpMethods} from "./http.methods.enum";
import RestServer from "../rest.server";

export default class HttpRouter {

    private readonly router = Router();

    constructor(route: string, restServer: RestServer) {
        restServer.addRouter(route, this.router);
    }

    addEndpoint(method: HttpMethods,
                endpoint: string,
                func: Function,
                params: [
                    ParamTypes,
                    string,
                    ...[Function, ...any][]
                ][] = []) {
        this.router[method](endpoint, (req: Request, res: Response) => {
            if (params.length === 0) {
                return res.send(func());
            }

            const output: string[] = [];

            params.forEach(param => output.push(this.handleParams(req, param)));

            res.send(func(...output));
        });
    }

    addMiddleware(func: (req: Request, res: Response, next: NextFunction) => void) {
        this.router.use(func);
    }

    private getParamValue(req: Request, type: ParamTypes, name: string): string | undefined {
        switch (type) {
            case ParamTypes.QUERY:
                return req.query[name] as string;
            case ParamTypes.BODY:
                return req.body[name];
        }
    }

    private handleParams(req: Request, param: [
        ParamTypes,
        string,
        ...[Function, ...any][]
        ]
    ): string {
        const val = this.getParamValue(req, param[0], param[1]);

        if (!val)
            throw Error(`Failed to parse parameter ${param[1]}.`);

        this.handleGuards(val, param.slice(2) as [Function, ...any][])

        return val;
    }

    private handleGuards(val: string, guards: [Function, ...any][]) {
        guards.forEach(guard => {
            guard[0](val, ...guard.slice(1));
        });
    }
}

export enum ParamTypes {
    QUERY,
    BODY
}