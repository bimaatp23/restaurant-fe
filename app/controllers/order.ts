import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type OrderService from 'restaurant-fe/services/order';
import type SessionService from 'restaurant-fe/services/session';
import type SwalService from 'restaurant-fe/services/swal';
import Swal from 'sweetalert2';

export default class OrderController extends Controller {
    @service order!: OrderService;
    @service session!: SessionService;
    @service swal!: SwalService;

    init() {
        super.init();
        this.doGetOrder();
    }

    async doGetOrder(): Promise<void> {
        await this.order.getOrder();
    }

    async doProcessOrder(id: string): Promise<void> {
        await this.order.processOrder(id).then((response) => {
            if (response.error_schema.error_code === 200) {
                this.swal.generate(
                    'success',
                    response.error_schema.error_message,
                );
            } else {
                this.swal.generate(
                    'error',
                    response.error_schema.error_message,
                );
            }
        });
    }

    async doDoneOrder(id: string): Promise<void> {
        await this.order.doneOrder(id).then((response) => {
            if (response.error_schema.error_code === 200) {
                this.swal.generate(
                    'success',
                    response.error_schema.error_message,
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
    processOrder(id: string): void {
        Swal.fire({
            title: 'Process Order Menu',
            confirmButtonText: 'Process',
            showCancelButton: true,
            text: 'Are you sure to process this order?',
            preConfirm: () => this.doProcessOrder(id),
        });
    }

    @action
    doneOrder(id: string): void {
        Swal.fire({
            title: 'Done Order Menu',
            confirmButtonText: 'Done',
            showCancelButton: true,
            text: 'Are you sure to done this order?',
            preConfirm: () => this.doDoneOrder(id),
        });
    }
}
