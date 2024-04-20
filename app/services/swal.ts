import Service from '@ember/service';
import type { SweetAlertIcon } from 'sweetalert2';
import Swal from 'sweetalert2';

export default class SwalService extends Service {
    generate(
        type: SweetAlertIcon,
        message: string,
        callback?: () => void,
    ): void {
        Swal.fire({
            title: message,
            icon: type,
            timer: 2000,
        }).then((value) => {
            if (callback) {
                callback();
            }
        });
    }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:swal')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('swal') declare altName: SwalService;`.
declare module '@ember/service' {
    interface Registry {
        swal: SwalService;
    }
}
