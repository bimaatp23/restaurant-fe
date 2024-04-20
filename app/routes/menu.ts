import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type MenuService from 'restaurant-fe/services/menu';

export default class MenuRoute extends Route {
    @service menu!: MenuService;

    async model() {
        await this.menu.getMenu();
    }
}
