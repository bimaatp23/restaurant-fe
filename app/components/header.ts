import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type { Session } from 'Session';
import type SessionService from 'restaurant-fe/services/session';

export default class HeaderComponent extends Component {
  @service session!: SessionService;

  activeSession: Session = this.session.getSession();
  isLogin: boolean = this.session.isLogin();

  @action
  doLogout() {
    this.session.removeSesssion();
    window.location.reload();
  }
}
