import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type OrderService from 'restaurant-fe/services/order';
import type SessionService from 'restaurant-fe/services/session';

export default class OrderRoute extends Route {
    @service router!: RouterService;
    @service session!: SessionService;
    @service order!: OrderService;

    beforeModel() {
        if (!this.session.isLogin) {
            this.router.transitionTo('home');
        }
    }

    async model() {
        await this.order.getOrder();
    }
}
