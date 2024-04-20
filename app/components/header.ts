import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CartService from 'restaurant-fe/services/cart';
import type SessionService from 'restaurant-fe/services/session';
import type SwalService from 'restaurant-fe/services/swal';

export default class HeaderComponent extends Component {
    @service router!: RouterService;
    @service session!: SessionService;
    @service swal!: SwalService;
    @service cart!: CartService;

    @action
    doLogout() {
        this.session.removeSesssion();
        this.swal.generate('success', 'Logout Success', () =>
            this.router.transitionTo('home'),
        );
    }

    @action
    consoleCart() {
        console.log(this.cart.activeCart);
    }
}
