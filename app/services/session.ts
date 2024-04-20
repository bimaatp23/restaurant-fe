import { action, computed } from '@ember/object';
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { Session } from 'Session';
import Constant from 'restaurant-fe/Constant';
import type CartService from './cart';

export default class SessionService extends Service {
    @service cart!: CartService;

    @tracked
    session: string | null = window.localStorage.getItem('session');

    getSession(): Session {
        let session: Session = {
            id: '',
            name: '',
            username: '',
            role: '',
            token: '',
        };
        if (this.session) {
            session = JSON.parse(this.session);
        }
        return session;
    }

    @action
    setSession(session: Session): void {
        this.session = JSON.stringify(session);
        window.localStorage.setItem('session', JSON.stringify(session));
    }

    @action
    removeSesssion(): void {
        this.session = null;
        window.localStorage.removeItem('session');
        this.cart.removeCart();
    }

    @computed('session')
    get activeSession(): Session {
        let session: Session = {
            id: '',
            name: '',
            username: '',
            role: '',
            token: '',
        };
        if (this.session) {
            session = JSON.parse(this.session);
        }
        return session;
    }

    @computed('session')
    get isLogin(): boolean {
        return !!this.getSession().name;
    }

    @computed('session')
    get isCustomer(): boolean {
        return (
            !!this.getSession().role &&
            this.getSession().role === Constant.ROLE_CUSTOMER
        );
    }

    @computed('session')
    get isAdmin(): boolean {
        return (
            !!this.getSession().role &&
            this.getSession().role === Constant.ROLE_ADMIN
        );
    }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:session')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('session') declare altName: SessionService;`.
declare module '@ember/service' {
    interface Registry {
        session: SessionService;
    }
}
