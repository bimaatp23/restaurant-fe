import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type SessionService from 'restaurant-fe/services/session';

export default class MenuController extends Controller {
    @service session!: SessionService;
    @service router!: RouterService;

    orderButtonText: string = this.session.isLogin
        ? this.session.isAdmin
            ? 'Edit'
            : 'Add to Cart'
        : 'Order Now';

    @action
    orderButtonAction() {
        if (this.session.isLogin) {
        } else {
            this.router.transitionTo('login');
        }
    }
}
