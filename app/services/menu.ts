import { computed } from '@ember/object';
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { BaseResp } from 'BaseResp';
import type { CreateMenuReq } from 'menu/CreateMenuReq';
import type { DeleteMenuReq } from 'menu/DeleteMenuReq';
import type { GetMenuResp } from 'menu/GetMenuResp';
import type { Menu } from 'menu/Menu';
import type { UpdateMenuReq } from 'menu/UpdateMenuReq';
import type ApiService from './api';
import type SessionService from './session';

export default class MenuService extends Service {
    @service api!: ApiService;
    @service session!: SessionService;

    @tracked
    menu: Menu[] = [];

    async getMenu(): Promise<GetMenuResp> {
        return this.api.getBasic('menu').then((response) => {
            this.menu = response.output_schema.sort((a: Menu, b: Menu) =>
                a.name
                    .trim()
                    .toLowerCase()
                    .localeCompare(b.name.trim().toLowerCase()),
            );
            return response;
        });
    }

    async createMenu(createMenuReq: CreateMenuReq): Promise<BaseResp> {
        return this.api
            .postToken('menu', createMenuReq, this.session.activeSession.token)
            .then((response) => {
                this.getMenu();
                return response;
            });
    }

    async updateMenu(updateMenuReq: UpdateMenuReq): Promise<BaseResp> {
        return this.api
            .putToken(
                `menu/${updateMenuReq.id}`,
                updateMenuReq,
                this.session.activeSession.token,
            )
            .then((response) => {
                this.getMenu();
                return response;
            });
    }

    async deleteMenu(deleteMenuReq: DeleteMenuReq): Promise<BaseResp> {
        return this.api
            .deleteToken(
                `menu/${deleteMenuReq.id}`,
                this.session.activeSession.token,
            )
            .then((response) => {
                this.getMenu();
                return response;
            });
    }

    @computed('menu')
    get activeMenu(): Menu[] {
        return this.menu;
    }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:menu')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('menu') declare altName: MenuService`.
declare module '@ember/service' {
    interface Registry {
        menu: MenuService;
    }
}
