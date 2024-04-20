import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { CreateMenuReq } from 'menu/CreateMenuReq';
import type { DeleteMenuReq } from 'menu/DeleteMenuReq';
import type { Menu } from 'menu/Menu';
import type { UpdateMenuReq } from 'menu/UpdateMenuReq';
import type CartService from 'restaurant-fe/services/cart';
import type MenuService from 'restaurant-fe/services/menu';
import type SessionService from 'restaurant-fe/services/session';
import type SwalService from 'restaurant-fe/services/swal';
import Swal from 'sweetalert2';

export default class MenuController extends Controller {
    @service session!: SessionService;
    @service router!: RouterService;
    @service swal!: SwalService;
    @service menu!: MenuService;
    @service cart!: CartService;

    init() {
        super.init();
        this.doGetMenu();
    }

    @tracked
    menuList: Menu[] = [];

    createMenuReq: CreateMenuReq = {
        name: '',
        description: '',
        price: 0,
        image: '',
    };

    updateMenuReq: UpdateMenuReq = {
        id: '',
        name: '',
        description: '',
        price: 0,
        image: '',
    };

    deleteMenuReq: DeleteMenuReq = {
        id: '',
    };

    async doGetMenu(): Promise<void> {
        await this.menu.getMenu().then((response) => {
            this.menuList = response.output_schema.sort((a, b) =>
                a.name
                    .trim()
                    .toLowerCase()
                    .localeCompare(b.name.trim().toLowerCase()),
            );
        });
    }

    async doCreateMenu(): Promise<void> {
        await this.menu.createMenu(this.createMenuReq).then((response) => {
            if (response.error_schema.error_code === 200) {
                this.swal.generate(
                    'success',
                    response.error_schema.error_message,
                    () => this.doGetMenu(),
                );
            } else {
                this.swal.generate(
                    'error',
                    response.error_schema.error_message,
                );
            }
        });
    }

    async doUpdateMenu() {
        await this.menu.updateMenu(this.updateMenuReq).then((response) => {
            if (response.error_schema.error_code === 200) {
                this.swal.generate(
                    'success',
                    response.error_schema.error_message,
                    () => this.doGetMenu(),
                );
            } else {
                this.swal.generate(
                    'error',
                    response.error_schema.error_message,
                );
            }
        });
    }

    async doDeleteMenu() {
        await this.menu.deleteMenu(this.deleteMenuReq).then((response) => {
            if (response.error_schema.error_code === 200) {
                this.swal.generate(
                    'success',
                    response.error_schema.error_message,
                    () => this.doGetMenu(),
                );
            } else {
                this.swal.generate(
                    'error',
                    response.error_schema.error_message,
                );
            }
        });
    }

    setCreateMenuReq(id: keyof CreateMenuReq, value: any) {
        this.createMenuReq = {
            ...this.createMenuReq,
            [id]: value,
        };
    }

    setUpdateMenuReq(id: keyof UpdateMenuReq, value: any) {
        this.updateMenuReq = {
            ...this.updateMenuReq,
            [id]: value,
        };
    }

    @action
    createMenu() {
        Swal.fire({
            title: 'Edit Menu',
            confirmButtonText: 'Save',
            showCancelButton: true,
            html: `
                    <input class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Enter menu name">
                    <input class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" placeholder="Enter menu description">
                    <input class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="price" type="number" placeholder="Enter menu price">
                    <input style="display: none;" id="image" type="file">
                    <label id="preview" for="image">
                    <div class="flex h-64 w-full justify-center items-center border border-dashed rounded cursor-pointer">Select Image</div>
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
                const preview = document.getElementById(
                    'preview',
                ) as HTMLLabelElement;

                [name, description, price].map((input: HTMLInputElement) => {
                    input.addEventListener('input', (event) => {
                        this.setCreateMenuReq(
                            input.id as keyof CreateMenuReq,
                            input.value,
                        );
                    });
                });

                image.addEventListener('change', (event) => {
                    if (image.files) {
                        const file = image.files[0];
                        if (file?.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const base64: string = e.target
                                    ?.result as string;
                                preview.innerHTML = `<img class="w-full h-64 mx-auto object-cover object-center cursor-pointer" id="preview" src="${base64}" alt="Image Preview" />`;
                                this.setCreateMenuReq('image', base64);
                            };
                            reader.readAsDataURL(file as Blob);
                        }
                    }
                });
            },
            preConfirm: () => this.doCreateMenu(),
        });
    }

    @action
    updateMenu(menu: Menu) {
        this.updateMenuReq = menu;
        Swal.fire({
            title: 'Edit Menu',
            confirmButtonText: 'Save',
            showCancelButton: true,
            html: `
                    <input class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${menu.name}" id="name" type="text" placeholder="Enter menu name">
                    <input class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${menu.description}" id="description" type="text" placeholder="Enter menu description">
                    <input class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${menu.price}" id="price" type="number" placeholder="Enter menu price">
                    <input style="display: none;" id="image" type="file">
                    <label for="image">
                    <img class="w-full h-64 mx-auto object-cover object-center cursor-pointer" id="preview" src="${menu.image}" alt="${menu.name}" />
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

                [name, description, price].map((input: HTMLInputElement) => {
                    input.addEventListener('input', (event) => {
                        this.setUpdateMenuReq(
                            input.id as keyof UpdateMenuReq,
                            input.value,
                        );
                    });
                });

                image.addEventListener('change', (event) => {
                    if (image.files) {
                        const file = image.files[0];
                        if (file?.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const base64: string = e.target
                                    ?.result as string;
                                img.src = base64;
                                this.setUpdateMenuReq('image', base64);
                            };
                            reader.readAsDataURL(file as Blob);
                        }
                    }
                });
            },
            preConfirm: () => this.doUpdateMenu(),
        });
    }

    @action
    deleteMenu(menu: Menu) {
        this.deleteMenuReq = menu;
        Swal.fire({
            title: 'Delete Menu',
            confirmButtonText: 'Delete',
            showCancelButton: true,
            text: 'Are you sure to delete this menu?',
            preConfirm: () => this.doDeleteMenu(),
        });
    }

    @computed('menuList')
    get menuListState(): Menu[] {
        return this.menuList;
    }
}
