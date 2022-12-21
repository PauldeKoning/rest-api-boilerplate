import RestServer from "../rest.server";
import {injectable} from "tsyringe";
import {NextFunction, Request, Response} from "express";
import {EndpointResponse} from "../model/endpoint.response";
import HttpError from "./error/http.error";

@injectable()
export default class ErrorHandler {

    constructor(restServer: RestServer) {
        restServer.addErrorHandler(this.handleError);
    }

    handleError(err: HttpError, req: Request, res: Response, next: NextFunction): void {
        if (!err.status) {
            err.status = 500;
        }

        console.error(err);

        const response: EndpointResponse<void> = {
            status: err.status,
            error: err.message
        }

        res.status(err.status);
        res.send(response);

        next();
    }

}