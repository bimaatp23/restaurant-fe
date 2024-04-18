import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type { Session } from 'Session';
import type SessionService from 'restaurant-fe/services/session';
import type SwalService from 'restaurant-fe/services/swal';

export default class HeaderComponent extends Component {
    @service session!: SessionService;
    @service swal!: SwalService;

    activeSession: Session = this.session.getSession();
    isLogin: boolean = this.session.isLogin();
    isAdmin: boolean = this.session.isAdmin();

    @action
    doLogout() {
        this.session.removeSesssion();
        this.swal.generate('success', 'Logout Success', () => {
            window.location.reload();
        });
    }
}
