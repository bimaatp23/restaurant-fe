import type { Cart } from 'cart/Cart';

export interface CreateOrderReq {
    total: number;
    items: Cart[];
}
