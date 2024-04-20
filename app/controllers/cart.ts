import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { service } from '@ember/service';
import type { Cart } from 'cart/Cart';
import type CartService from 'restaurant-fe/services/cart';
import type OrderService from 'restaurant-fe/services/order';
import type SwalService from 'restaurant-fe/services/swal';
import Swal from 'sweetalert2';

export default class CartController extends Controller {
    @service cart!: CartService;
    @service order!: OrderService;
    @service swal!: SwalService;

    async doCreateOrder(): Promise<void> {
        await this.order
            .createOrder({ total: this.total, items: this.cart.activeCart })
            .then((response) => {
                if (response.error_schema.error_code === 200) {
                    this.swal.generate(
                        'success',
                        response.error_schema.error_message,
                        () => this.cart.removeCart(),
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
    increaseQuantity(cart: Cart): void {
        this.cart.addMenu({
            ...cart,
            id: '',
            image: '',
            description: '',
        });
    }

    @action
    decreaseQuantity(cart: Cart): void {
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
            preConfirm: () => this.doCreateOrder(),
        });
    }

    @computed('cart.{activeCart,cart}')
    get total(): number {
        let total: number = 0;
        this.cart.activeCart.map((value) => (total += value.subtotal));
        return total;
    }
}
