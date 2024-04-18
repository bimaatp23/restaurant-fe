import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type SessionService from 'restaurant-fe/services/session';

export default class RegisterRoute extends Route {
    @service router!: RouterService;
    @service session!: SessionService;

    beforeModel() {
        if (this.session.isLogin) {
            this.router.transitionTo('home');
        }
    }
}
