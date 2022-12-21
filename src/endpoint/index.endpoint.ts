import IndexRouter from '../router/impl/index.router';
import { HttpMethods } from '../router/http.methods.enum';
import { singleton } from 'tsyringe';
import { EndpointResponse } from '../model/endpoint.response';

@singleton()
export default class IndexEndpoint {
  constructor(indexRouter: IndexRouter) {
    indexRouter.addEndpoint(HttpMethods.GET, '/', this.get);
  }

  private get(): EndpointResponse<string> {
    return {
      status: 200,
      data: 'index'
    };
  }
}
