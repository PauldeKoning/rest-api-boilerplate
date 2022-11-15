import {HttpMethods} from "../router/http.methods.enum";
import AdminRouter from "../router/impl/admin.router";
import {singleton} from "tsyringe";
import {ParamTypes} from "../router/http.router";
import {stringGuard} from "../guards/string.guard";
import {regexGuard} from "../guards/regex.guard";

@singleton()
export default class AdminEndpoint {

    private user: User = {
        name: "user",
        secret: "ID-5"
    }

    constructor(adminRouter: AdminRouter) {
        adminRouter.addEndpoint(HttpMethods.GET, '/', this.get.bind(this));
        adminRouter.addEndpoint(HttpMethods.POST, '/', this.post.bind(this), [
            [
                ParamTypes.BODY,
                'secret',
                [stringGuard, 4, 32],
                [regexGuard, RegExp("^ID-")]
            ]
        ]);
    }

    private get(): EndpointResponse<User> {
        return {
            status: 200,
            data: this.user
        }
    }

    private post(secret: string): EndpointResponse<boolean> {
        this.user.secret = secret;

        return {
            status: 200,
            data: true
        }
    }
}