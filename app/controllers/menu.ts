import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { EditMenuReq } from 'menu/EditMenuReq';
import type { Menu } from 'menu/Menu';
import type MenuService from 'restaurant-fe/services/menu';
import type SessionService from 'restaurant-fe/services/session';
import type SwalService from 'restaurant-fe/services/swal';
import Swal from 'sweetalert2';

export default class MenuController extends Controller {
    @service session!: SessionService;
    @service router!: RouterService;
    @service swal!: SwalService;
    @service menu!: MenuService;

    init() {
        super.init();
        this.getMenu();
    }

    @tracked
    menuList: Menu[] = [];

    async getMenu(): Promise<void> {
        await this.menu.getMenu().then((response) => {
            this.menuList = response.output_schema.sort((a, b) =>
                a.name
                    .trim()
                    .toLocaleLowerCase()
                    .localeCompare(b.name.trim().toLocaleLowerCase()),
            );
        });
    }

    editMenuReq: EditMenuReq = {
        id: '',
        name: '',
        description: '',
        price: 0,
        image: '',
    };

    setEditMenuReq(id: keyof EditMenuReq, value: any) {
        this.editMenuReq = {
            ...this.editMenuReq,
            [id]: value,
        };
    }

    async doEditMenuReq() {
        await this.menu.updateMenu(this.editMenuReq).then((response) => {
            if (response.error_schema.error_code === 200) {
                this.swal.generate(
                    'success',
                    response.error_schema.error_message,
                    () => this.getMenu(),
                );
            } else {
                this.swal.generate(
                    'error',
                    response.error_schema.error_message,
                );
            }
        });
    }

    @action
    orderButtonAction(menu: Menu) {
        if (this.session.isLogin) {
            this.editMenuReq = menu;
            Swal.fire({
                title: 'Edit Menu',
                confirmButtonText: 'Save',
                html: `
                <input class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${menu.name}" id="name" type="text" placeholder="Enter menu name">
                <input class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${menu.description}" id="description" type="text" placeholder="Enter menu description">
                <input class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${menu.price}" id="price" type="number" placeholder="Enter menu price">
                <input style="display: none;" id="image" type="file">
                <label for="image">
                <img class="w-full h-64 mx-auto object-cover object-center" id="preview" src="${menu.image}" alt="${menu.name}" />
                </label>
                `,
                didOpen: () => {
                    const name = document.getElementById(
                        'name',
                    ) as HTMLInputElement;
                    const description = document.getElementById(
                        'description',
                    ) as HTMLInputElement;
                    const price = document.getElementById(
                        'price',
                    ) as HTMLInputElement;
                    const image = document.getElementById(
                        'image',
                    ) as HTMLInputElement;
                    const img = document.getElementById(
                        'preview',
                    ) as HTMLImageElement;

                    [name, description, price].map(
                        (input: HTMLInputElement) => {
                            input.addEventListener('input', (event) => {
                                this.setEditMenuReq(
                                    input.id as keyof EditMenuReq,
                                    input.value,
                                );
                            });
                        },
                    );

                    image.addEventListener('change', (event) => {
                        if (image.files) {
                            const file = image.files[0];
                            if (file?.type.startsWith('image/')) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const base64: string = e.target
                                        ?.result as string;
                                    img.src = base64;
                                    this.setEditMenuReq('image', base64);
                                };
                                reader.readAsDataURL(file as Blob);
                            }
                        }
                    });
                },
                preConfirm: () => this.doEditMenuReq(),
            });
        } else {
            this.router.transitionTo('login');
        }
    }

    @computed('menuList')
    get menuListState(): Menu[] {
        return this.menuList;
    }

    @computed('session.{isAdmin,isLogin,session}')
    get orderButtonText(): string {
        return this.session.isLogin
            ? this.session.isAdmin
                ? 'Edit'
                : 'Add to Cart'
            : 'Order Now';
    }
}
