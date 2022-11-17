# Rest API Boilerplate

This project serves as a simple Rest API boilerplate written in TypeScript. 

It includes a limited set of features to make the development experience easier:

- Define routers
  - Middleware per router
- Define endpoints
  - Define routes
  - Input validation per route
- Error handling

## Concepts

### Endpoint

An endpoint defines a route and an associated HTTP method that will be registered on a router.

The endpoint is registered with a function. This function has the `EndpointResponse<T>` return value. 
This ensures a consistent JSON output throughout the application. The generic value can be changed to any data type.

```javascript
@singleton()
export default class IndexEndpoint {

    constructor(indexRouter: IndexRouter) {
        indexRouter.addEndpoint(HttpMethods.GET, '/', this.get);
    }

    private get(): EndpointResponse<string> {
        return {
            status: 200,
            data: "index"
        }
    }
}
```

Data validation can be added in the `addEndpoint` method and will then be able to be accessed in the given function. An example can be found in the 'Data Validation' section.

When adding an endpoint, make sure to resolve it in `index.ts`:

```javascript
container.resolve(IndexEndpoint);
```


### Router
The goal of the router is to route a request to a specified endpoint and if needed, validate any data sent within the request.
In the example underneath, any request sent to `/admin` will be handled by this router. Any request will have to pass through the `hasToBeLoggedIn` middleware method.

```javascript
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
```
### Data Validation (Guards)

Query and body data can be validated using guard functions. 
In this example we will validate a body parameter called `secret` using a guard which takes in a `min` and `max` amount of character.

NOTE: Simply adding a parameter acts as a 'Not Null' guard. It is not possible to create optional parameters at the moment.

Create a simple guard function:

```javascript
export function stringGuard(input: string, min: number, max: number): void {
    if (input.length < min || input.length > max)
        throw Error(`String ${input} is lower than min value ${min} or exceeds max value ${max}`);
}
```

Then use it while creating an endpoint:

```javascript
adminRouter.addEndpoint(HttpMethods.POST, '/', this.post.bind(this), [
        [
            ParamTypes.BODY, 
            'secret',
            [stringGuard, 4, 32],
        ]
    ]);
```

Then use the value, in this case `secret`, in your endpoint function:

```typescript
@singleton()
export default class AdminEndpoint {
    
  // constructor() {...
    
  private post(secret: string): EndpointResponse<boolean> {
    this.user.secret = secret;

    return {
      status: 200,
      data: true
    }
  }
}
```

Adding multiple guards to a single parameter is possible, here a `regexGuard` is added:

```javascript
adminRouter.addEndpoint(HttpMethods.POST, '/', this.post.bind(this), [
        [
            ParamTypes.BODY,
            'secret',
            [stringGuard, 4, 32],
            [regexGuard, RegExp("^ID-")]
        ]
    ]);
```

Adding a second parameter is possible simply by adding extending the existing array in the `addEndpoint` function and adding a new parameter in the given endpoint function.

## Todo

- Create unit tests
- Ability for global middleware
- Ability to add a router to a router