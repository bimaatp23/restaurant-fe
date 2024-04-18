import EmberRouter from '@ember/routing/router';
import config from 'restaurant-fe/config/environment';

export default class Router extends EmberRouter {
    location = config.locationType;
    rootURL = config.rootURL;
}

Router.map(function () {
    this.route('home', { path: '/' });
    this.route('menu');
    this.route('profile');
    this.route('login');
    this.route('register');
});
