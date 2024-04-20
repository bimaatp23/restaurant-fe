import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { service } from '@ember/service';
import type { Cart } from 'cart/Cart';
import type CartService from 'restaurant-fe/services/cart';
import Swal from 'sweetalert2';

export default class CartController extends Controller {
    @service cart!: CartService;

    @action
    increaseQuantity(cart: Cart) {
        this.cart.addMenu({
            ...cart,
            id: '',
            image: '',
            description: '',
        });
    }

    @action
    decreaseQuantity(cart: Cart) {
        this.cart.removeMenu({
            ...cart,
            id: '',
            image: '',
            description: '',
        });
    }

    @action
    checkout(): void {
        Swal.fire({
            title: 'Checkout Menu',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            text: `Are you sure to checkout (Total $ ${this.total})?`,
            preConfirm: () => {
                console.log({
                    total: this.total,
                    items: this.cart.activeCart,
                });
                this.cart.removeCart();
            },
        });
    }

    @computed('cart.{activeCart,cart}')
    get total(): number {
        let total: number = 0;
        this.cart.activeCart.map((value) => (total += value.subtotal));
        return total;
    }
}
