import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { UpdateAdminReq } from 'admin/UpdateAdminReq';
import type { UpdateCustomerReq } from 'customer/UpdateCustomerReq';
import Constant from 'restaurant-fe/Constant';
import type AdminService from 'restaurant-fe/services/admin';
import type CustomerService from 'restaurant-fe/services/customer';
import type SessionService from 'restaurant-fe/services/session';
import type SwalService from 'restaurant-fe/services/swal';

export default class ProfileController extends Controller {
    @service session!: SessionService;
    @service customer!: CustomerService;
    @service admin!: AdminService;
    @service swal!: SwalService;

    @tracked
    isUpdate: boolean = false;

    @tracked
    updateReq: UpdateCustomerReq | UpdateAdminReq = {
        name: this.session.activeSession.name,
        username: this.session.activeSession.username,
    };

    @action
    setIsUpdate() {
        this.isUpdate = !this.isUpdate;
    }

    @action
    setUpdateReq(event: InputEvent) {
        const target = event.target as HTMLInputElement;
        this.updateReq = {
            ...this.updateReq,
            [target.id as
                | keyof (keyof UpdateCustomerReq)
                | keyof UpdateAdminReq]: target.value,
        };
    }

    @action
    async doUpdate() {
        if (this.isUpdateValid) {
            if (this.session.activeSession.role === Constant.ROLE_CUSTOMER) {
                await this.customer.update(this.updateReq).then((response) => {
                    if (response.error_schema.error_code === 200) {
                        this.session.setSession({
                            ...this.session.activeSession,
                            name: this.updateReq.name,
                            username: this.updateReq.username,
                        });
                        this.isUpdate = !this.isUpdate;
                        this.swal.generate(
                            'success',
                            response.error_schema.error_message,
                        );
                    } else {
                        this.swal.generate(
                            'error',
                            response.error_schema.error_message,
                        );
                    }
                });
            } else {
                await this.admin.update(this.updateReq).then((response) => {
                    if (response.error_schema.error_code === 200) {
                        this.session.setSession({
                            ...this.session.activeSession,
                            name: this.updateReq.name,
                            username: this.updateReq.username,
                        });
                        this.isUpdate = !this.isUpdate;
                        this.swal.generate(
                            'success',
                            response.error_schema.error_message,
                        );
                    } else {
                        this.swal.generate(
                            'error',
                            response.error_schema.error_message,
                        );
                    }
                });
            }
        }
    }

    @computed('isUpdate')
    get isUpdateState(): boolean {
        return this.isUpdate;
    }

    @computed('updateReq.{name,username}')
    get isUpdateValid(): boolean {
        return !!this.updateReq.name && !!this.updateReq.username;
    }
}
