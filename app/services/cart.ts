import { action, computed } from '@ember/object';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { Cart } from 'cart/Cart';
import type { Menu } from 'menu/Menu';

export default class CartService extends Service {
    @tracked
    cart: string | null = window.localStorage.getItem('cart');

    getCart(): Cart[] {
        let cart: Cart[] = [];
        if (this.cart) {
            cart = (JSON.parse(this.cart) as Cart[]).sort((a, b) =>
                a.name
                    .trim()
                    .toLowerCase()
                    .localeCompare(b.name.trim().toLowerCase()),
            );
        }
        return cart;
    }

    @action
    addMenu(menu: Menu): void {
        let cart: Cart[] = this.getCart();
        if (cart.filter((value) => value.name === menu.name).length === 0) {
            cart.push({
                name: menu.name,
                price: menu.price,
                quantity: 1,
                subtotal: menu.price,
            });
        } else {
            cart = cart.map((value) => {
                const newValue: Cart = value;
                if (newValue.name === menu.name) {
                    newValue.quantity += 1;
                    newValue.subtotal = menu.price * newValue.quantity;
                }
                return newValue;
            });
        }
        this.cart = JSON.stringify(cart);
        window.localStorage.setItem('cart', JSON.stringify(cart));
    }

    @action
    removeMenu(menu: Menu): void {
        let cart: Cart[] = this.getCart();
        if (cart.filter((value) => value.name === menu.name).length !== 0) {
            cart = cart.map((value) => {
                const newValue: Cart = value;
                if (newValue.name === menu.name) {
                    newValue.quantity = newValue.quantity - 1;
                    newValue.subtotal = menu.price * newValue.quantity;
                }
                return newValue;
            });
        }
        cart = cart.filter((value) => value.quantity > 0);
        this.cart = JSON.stringify(cart);
        window.localStorage.setItem('cart', JSON.stringify(cart));
    }

    @action
    removeCart(): void {
        this.cart = null;
        window.localStorage.removeItem('cart');
    }

    @computed('cart')
    get activeCart(): Cart[] {
        return this.getCart();
    }

    @computed('cart')
    get cartCount(): number {
        let count: number = 0;
        this.getCart().map((value) => (count += value.quantity));
        return count;
    }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:cart')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('cart') declare altName: CartService;`.
declare module '@ember/service' {
    interface Registry {
        cart: CartService;
    }
}
