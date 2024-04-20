export interface Order {
    id: string;
    customer_id: string;
    customer_name: string;
    total: number;
    date: string;
    status: string;
    items: Item[];
}

interface Item {
    id: string;
    order_id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}
