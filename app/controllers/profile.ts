import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type ChangePasswordAdminReq from 'admin/ChangePasswordAdminReq';
import type { UpdateAdminReq } from 'admin/UpdateAdminReq';
import type ChangePasswordCustomerReq from 'customer/ChangePasswordCustomerReq';
import type { UpdateCustomerReq } from 'customer/UpdateCustomerReq';
import Constant from 'restaurant-fe/Constant';
import type AdminService from 'restaurant-fe/services/admin';
import type CustomerService from 'restaurant-fe/services/customer';
import type SessionService from 'restaurant-fe/services/session';
import type SwalService from 'restaurant-fe/services/swal';

export default class ProfileController extends Controller {
    @service router!: RouterService;
    @service session!: SessionService;
    @service customer!: CustomerService;
    @service admin!: AdminService;
    @service swal!: SwalService;

    @tracked
    isUpdate: boolean = false;

    @tracked
    isChangePassword: boolean = false;

    @tracked
    updateReq: UpdateCustomerReq | UpdateAdminReq = {
        name: this.session.activeSession.name,
        username: this.session.activeSession.username,
    };

    @tracked
    changePasswordReq: ChangePasswordCustomerReq | ChangePasswordAdminReq = {
        new_password: '',
    };

    @action
    setIsUpdate() {
        this.isUpdate = !this.isUpdate;
    }

    @action
    setIsChangePassword() {
        this.changePasswordReq = {
            new_password: '',
        };
        this.isChangePassword = !this.isChangePassword;
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
    setChangePasswordReq(event: InputEvent) {
        const target = event.target as HTMLInputElement;
        this.changePasswordReq = {
            ...this.changePasswordReq,
            [target.id as
                | keyof (keyof ChangePasswordCustomerReq)
                | keyof ChangePasswordAdminReq]: target.value,
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
                        this.setIsUpdate();
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
                        this.setIsUpdate();
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

    @action
    async doChangePassword() {
        if (this.isChangePasswordValid) {
            if (this.session.activeSession.role === Constant.ROLE_CUSTOMER) {
                await this.customer
                    .changePassword(this.changePasswordReq)
                    .then((response) => {
                        if (response.error_schema.error_code === 200) {
                            this.session.removeSesssion();
                            this.setIsChangePassword();
                            this.swal.generate(
                                'success',
                                response.error_schema.error_message,
                                () => {
                                    this.router.transitionTo('home');
                                },
                            );
                        } else {
                            this.swal.generate(
                                'error',
                                response.error_schema.error_message,
                            );
                        }
                    });
            } else {
                await this.admin
                    .changePassword(this.changePasswordReq)
                    .then((response) => {
                        if (response.error_schema.error_code === 200) {
                            this.session.removeSesssion();
                            this.setIsChangePassword();
                            this.swal.generate(
                                'success',
                                response.error_schema.error_message,
                                () => {
                                    this.router.transitionTo('home');
                                },
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

    @computed('isChangePassword')
    get isChangePasswordState(): boolean {
        return this.isChangePassword;
    }

    @computed('updateReq.{name,username}')
    get isUpdateValid(): boolean {
        return !!this.updateReq.name && !!this.updateReq.username;
    }

    @computed('changePasswordReq.new_password')
    get isChangePasswordValid(): boolean {
        return !!this.changePasswordReq.new_password;
    }
}
