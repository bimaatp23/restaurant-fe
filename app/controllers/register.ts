import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { RegisterCustomerReq } from 'customer/RegisterCustomerReq';
import type CustomerService from 'restaurant-fe/services/customer';

export default class RegisterController extends Controller {
  @service router!: RouterService;
  @service customer!: CustomerService;

  @tracked
  registerReq: RegisterCustomerReq = {
    name: '',
    username: '',
    password: '',
  };

  @action
  updateData(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.registerReq = {
      ...this.registerReq,
      [target.id as keyof RegisterCustomerReq]: target.value,
    };
  }

  @action
  async doRegister() {
    if (this.isValid) {
      await this.customer.register(this.registerReq).then((response) => {
        if (response.error_schema.error_code === 200) {
          this.router.transitionTo('home');
        }
      });
    }
  }

  @computed('registerReq.{name,password,username}')
  get isValid(): boolean {
    return (
      !!this.registerReq.name &&
      !!this.registerReq.username &&
      !!this.registerReq.password
    );
  }
}
