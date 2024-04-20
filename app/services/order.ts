import { computed } from '@ember/object';
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { BaseResp } from 'BaseResp';
import type { CreateOrderReq } from 'order/CreateOrderReq';
import type { Order } from 'order/Order';
import Constant from 'restaurant-fe/Constant';
import type ApiService from './api';
import type SessionService from './session';

interface NewOrder extends Order {
    isPending: boolean;
    isProcess: boolean;
    isDone: boolean;
}

export default class OrderService extends Service {
    @service api!: ApiService;
    @service session!: SessionService;

    @tracked
    order: NewOrder[] = [];

    async getOrder(): Promise<BaseResp> {
        return this.api
            .getToken('order', this.session.activeSession.token)
            .then((response) => {
                this.order = response.output_schema
                    .map((order: Order) => {
                        return {
                            ...order,
                            isPending: order.status === Constant.STATUS_PENDING,
                            isProcess: order.status === Constant.STATUS_PROCESS,
                            isDone: order.status === Constant.STATUS_DONE,
                        };
                    })
                    .sort((a: Order, b: Order) => b.date.localeCompare(a.date));
                return response;
            });
    }

    async createOrder(createOrderReq: CreateOrderReq): Promise<BaseResp> {
        return this.api
            .postToken(
                'order',
                {
                    total: createOrderReq.total,
                    items: JSON.stringify(createOrderReq.items),
                },
                this.session.activeSession.token,
            )
            .then((response) => {
                this.getOrder();
                return response;
            });
    }

    async processOrder(id: string): Promise<BaseResp> {
        return this.api
            .putToken(
                `order/process/${id}`,
                {},
                this.session.activeSession.token,
            )
            .then((response) => {
                this.getOrder();
                return response;
            });
    }

    async doneOrder(id: string): Promise<BaseResp> {
        return this.api
            .putToken(`order/done/${id}`, {}, this.session.activeSession.token)
            .then((response) => {
                this.getOrder();
                return response;
            });
    }

    @computed('order')
    get activeOrder(): Order[] {
        return this.order;
    }

    @computed('order.length')
    get orderCount(): number {
        return this.order.length;
    }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:order')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('order') declare altName: OrderService;`.
declare module '@ember/service' {
    interface Registry {
        order: OrderService;
    }
}
