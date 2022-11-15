import {singleton} from "tsyringe";
import HttpRouter from "../http.router";
import RestServer from "../../rest.server";

@singleton()
export default class IndexRouter extends HttpRouter {

    constructor(restServer: RestServer) {
        super('/', restServer);
    }

}