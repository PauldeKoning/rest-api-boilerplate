import {singleton} from "tsyringe";
import RestServer from "../../rest.server";
import HttpRouter from "../http.router";
import {NextFunction, Request, Response} from "express";

@singleton()
export default class AdminRouter extends HttpRouter {

    private password = "admin123";

    constructor(restServer: RestServer) {
        super('/admin', restServer);

        this.addMiddleware(this.hasToBeLoggedIn.bind(this));
    }

    hasToBeLoggedIn(req: Request, res: Response, next: NextFunction) {
        if (req.query.password !== this.password) {
            return res.send("Password invalid");
        }

        next();
    }

}