import Service, { service } from '@ember/service';
import type { BaseResp } from 'BaseResp';
import type { LoginAdminReq } from 'admin/LoginAdminReq';
import type { LoginAdminResp } from 'admin/LoginAdminResp';
import type { UpdateAdminReq } from 'admin/UpdateAdminReq';
import type ApiService from './api';
import type SessionService from './session';

export default class AdminService extends Service {
    @service api!: ApiService;
    @service session!: SessionService;

    async login(loginReq: LoginAdminReq): Promise<LoginAdminResp> {
        return this.api.postBasic('admin/login', loginReq);
    }

    async update(updateReq: UpdateAdminReq): Promise<BaseResp> {
        return this.api.putToken(
            'admin/update',
            updateReq,
            this.session.activeSession.token,
        );
    }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:admin')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('admin') declare altName: AdminService;`.
declare module '@ember/service' {
    interface Registry {
        admin: AdminService;
    }
}
