import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Constant from 'restaurant-fe/Constant';
import type SessionService from 'restaurant-fe/services/session';
import RSVP from 'rsvp';

export default class LoginRoute extends Route {
    @service router!: RouterService;
    @service session!: SessionService;

    beforeModel() {
        if (this.session.isLogin) {
            this.router.transitionTo('home');
        }
    }

    model() {
        const availableRoles: { value: string; caption: string }[] = [
            Constant.ROLE_CUSTOMER,
            Constant.ROLE_ADMIN,
        ].map((role) => {
            return {
                value: role,
                caption: role.toUpperCase(),
            };
        });
        return RSVP.hash({
            availableRoles: availableRoles,
        });
    }
}
