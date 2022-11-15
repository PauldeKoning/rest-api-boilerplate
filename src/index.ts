import "reflect-metadata";
import IndexEndpoint from "./endpoint/index.endpoint";
import {container} from "tsyringe";
import AdminEndpoint from "./endpoint/admin.endpoint";


container.resolve(IndexEndpoint);
container.resolve(AdminEndpoint);
