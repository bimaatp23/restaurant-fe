import Service, { service } from '@ember/service';
import type { BaseResp } from 'BaseResp';
import type { RegisterCustomerReq } from 'customer/RegisterCustomerReq';
import type ApiService from './api';

export default class CustomerService extends Service {
  @service api!: ApiService;

  async register(registerReq: RegisterCustomerReq): Promise<BaseResp> {
    return this.api.postBasic('customer/register', registerReq);
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:customer')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('customer') declare altName: CustomerService;`.
declare module '@ember/service' {
  interface Registry {
    customer: CustomerService;
  }
}