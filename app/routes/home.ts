import { action } from '@ember/object'
import Route from '@ember/routing/route'
import { service } from '@ember/service'
import type { Menu } from 'menu/Menu'
import type MenuService from 'restaurant-fe/services/menu'
import RSVP from 'rsvp'

export default class HomeRoute extends Route {
  @service menu!: MenuService

  menuList: Menu[] = []

  @action
  async getMenu(): Promise<void> {
    await this.menu.getMenu().then(response => { this.menuList = response.output_schema })
  }

  async model() {
    await this.getMenu()

    return RSVP.hash({
      menuList: this.menuList
    })
  }
}
