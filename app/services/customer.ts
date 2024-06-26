import Service, { service } from '@ember/service';
import type { BaseResp } from 'BaseResp';
import type ChangePasswordCustomerReq from 'customer/ChangePasswordCustomerReq';
import type { LoginCustomerReq } from 'customer/LoginCustomerReq';
import type { LoginCustomerResp } from 'customer/LoginCustomerResp';
import type { RegisterCustomerReq } from 'customer/RegisterCustomerReq';
import type { UpdateCustomerReq } from 'customer/UpdateCustomerReq';
import type ApiService from './api';
import type SessionService from './session';

export default class CustomerService extends Service {
    @service api!: ApiService;
    @service session!: SessionService;

    async register(registerReq: RegisterCustomerReq): Promise<BaseResp> {
        return this.api.postBasic('customer/register', registerReq);
    }

    async login(loginReq: LoginCustomerReq): Promise<LoginCustomerResp> {
        return this.api.postBasic('customer/login', loginReq);
    }

    async update(updateReq: UpdateCustomerReq): Promise<BaseResp> {
        return this.api.putToken(
            'customer/update',
            updateReq,
            this.session.activeSession.token,
        );
    }

    async changePassword(
        changePasswordReq: ChangePasswordCustomerReq,
    ): Promise<BaseResp> {
        return this.api.putToken(
            'customer/change-password',
            changePasswordReq,
            this.session.activeSession.token,
        );
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
