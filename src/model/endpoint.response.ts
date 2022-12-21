export interface EndpointResponse<T> {
  status: number;
  error?: string;
  data?: T;
}
