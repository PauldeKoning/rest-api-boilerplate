import 'reflect-metadata';
import IndexEndpoint from './endpoint/index.endpoint';
import { container } from 'tsyringe';
import AdminEndpoint from './endpoint/admin.endpoint';
import ErrorHandler from './util/error.handler.util';

// Add new endpoints below
container.resolve(IndexEndpoint);
container.resolve(AdminEndpoint);

// Leave the error handler as last
container.resolve(ErrorHandler);
