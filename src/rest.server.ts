import {singleton} from "tsyringe";
import express, {Router} from "express";

@singleton()
export default class RestServer {

    private readonly port = 3000;
    private readonly app = express();

    constructor() {
        this.app.use(express.json())
        this.app.listen(this.port, () => this.listen());
    }

    private listen(): void {
        console.log("Server started on port", this.port);
    }

    addRouter(route: string, router: Router): void {
        this.app.use(route, router);
    }
}