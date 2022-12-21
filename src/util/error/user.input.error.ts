import HttpError from "./http.error";

export default class UserInputError extends HttpError {
    constructor(msg: string) {
        super(400, `User Input Error: ${msg}`);
    }
}