import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { LoginAdminReq } from 'admin/LoginAdminReq';
import type { LoginCustomerReq } from 'customer/LoginCustomerReq';
import Constant from 'restaurant-fe/Constant';
import type AdminService from 'restaurant-fe/services/admin';
import type CustomerService from 'restaurant-fe/services/customer';
import type SessionService from 'restaurant-fe/services/session';
import type SwalService from 'restaurant-fe/services/swal';

export default class LoginController extends Controller {
    @service router!: RouterService;
    @service customer!: CustomerService;
    @service admin!: AdminService;
    @service session!: SessionService;
    @service swal!: SwalService;

    @tracked
    loginReq: LoginCustomerReq | LoginAdminReq = {
        username: '',
        password: '',
    };

    @tracked
    selectedRole: string = '';

    @action
    updateData(event: InputEvent): void {
        const target = event.target as HTMLInputElement;
        this.loginReq = {
            ...this.loginReq,
            [target.id as keyof LoginCustomerReq | keyof LoginAdminReq]:
                target.value,
        };
    }

    @action
    selectRole(event: InputEvent): void {
        const target = event.target as HTMLSelectElement;
        this.selectedRole = target.value;
    }

    @action
    async doLogin(): Promise<void> {
        if (this.isValid) {
            if (this.selectedRole === Constant.ROLE_CUSTOMER) {
                await this.customer.login(this.loginReq).then((response) => {
                    if (response.error_schema.error_code === 200) {
                        this.session.setSession(response.output_schema);
                        this.swal.generate(
                            'success',
                            response.error_schema.error_message,
                            () => this.router.transitionTo('home'),
                        );
                    } else {
                        this.swal.generate(
                            'error',
                            response.error_schema.error_message,
                        );
                    }
                });
            } else {
                await this.admin.login(this.loginReq).then((response) => {
                    if (response.error_schema.error_code === 200) {
                        this.session.setSession(response.output_schema);
                        this.loginReq = {
                            username: '',
                            password: '',
                        };
                        this.selectedRole = '';
                        this.swal.generate(
                            'success',
                            response.error_schema.error_message,
                            () => this.router.transitionTo('home'),
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

    @computed('loginReq.{password,username}', 'selectedRole')
    get isValid(): boolean {
        return (
            !!this.loginReq.username &&
            !!this.loginReq.password &&
            !!this.selectedRole
        );
    }
}
