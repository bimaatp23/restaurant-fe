import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { LoginCustomerReq } from 'customer/LoginCustomerReq';
import type CustomerService from 'restaurant-fe/services/customer';

export default class LoginController extends Controller {
    @service router!: RouterService;
    @service customer!: CustomerService;

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
                    this.router.transitionTo('home');
                }
            });
        }
    }

    @computed('loginReq.{password,username}')
    get isValid(): boolean {
        return (
            !!this.loginReq.username &&
            !!this.loginReq.password
        );
    }
}