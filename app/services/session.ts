import Service from '@ember/service';
import type { Session } from 'Session';

export default class SessionService extends Service {
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

    setSession(session: Session): void {
        window.localStorage.setItem('session', JSON.stringify(session));
    }

    removeSesssion(): void {
        window.localStorage.removeItem('session');
    }

    isLogin(): boolean {
        return !!this.getSession().name;
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
