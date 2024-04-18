import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { LoginCustomerReq } from 'customer/LoginCustomerReq';
import type CustomerService from 'restaurant-fe/services/customer';
import type SessionService from 'restaurant-fe/services/session';
import type SwalService from 'restaurant-fe/services/swal';

export default class LoginController extends Controller {
    @service router!: RouterService;
    @service customer!: CustomerService;
    @service session!: SessionService;
    @service swal!: SwalService;

    @tracked
    loginReq: LoginCustomerReq = {
        username: '',
        password: '',
    };

    @action
    updateData(event: InputEvent) {
        const target = event.target as HTMLInputElement;
        this.loginReq = {
            ...this.loginReq,
            [target.id as keyof LoginCustomerReq]: target.value,
        };
    }

    @action
    async doLogin() {
        if (this.isValid) {
            await this.customer.login(this.loginReq).then((response) => {
                if (response.error_schema.error_code === 200) {
                    this.session.setSession(response.output_schema);
                    this.swal.generate(
                        'success',
                        response.error_schema.error_message,
                        () => {
                            window.location.assign('/');
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

    @computed('loginReq.{password,username}')
    get isValid(): boolean {
        return !!this.loginReq.username && !!this.loginReq.password;
    }
}
