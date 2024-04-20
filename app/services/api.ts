import Service from '@ember/service';
import ENV from '../config/environment'

export default class ApiService extends Service {
    endpoint: string = ENV.APP['ENDPOINT'] as string;

    async getBasic(url: string): Promise<any> {
        return await fetch(`${this.endpoint}/api/${url}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((json) => json);
    }

    async postBasic(url: string, data: Object): Promise<any> {
        const formData = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        return await fetch(`${this.endpoint}/api/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            body: formData.toString(),
        })
            .then((response) => response.json())
            .then((json) => json);
    }

    async getToken(url: string, accessToken: string): Promise<any> {
        return await fetch(
            `${this.endpoint}/api/${url}?access_token=${accessToken}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            },
        )
            .then((response) => response.json())
            .then((json) => json);
    }

    async postToken(
        url: string,
        data: Object,
        accessToken: string,
    ): Promise<any> {
        const formData = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        return await fetch(
            `${this.endpoint}/api/${url}?access_token=${accessToken}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
                body: formData.toString(),
            },
        )
            .then((response) => response.json())
            .then((json) => json);
    }

    async putToken(
        url: string,
        data: Object,
        accessToken: string,
    ): Promise<any> {
        const formData = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        return await fetch(
            `${this.endpoint}/api/${url}?access_token=${accessToken}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
                body: formData.toString(),
            },
        )
            .then((response) => response.json())
            .then((json) => json);
    }

    async deleteToken(url: string, accessToken: string): Promise<any> {
        return await fetch(
            `${this.endpoint}/api/${url}?access_token=${accessToken}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
            },
        )
            .then((response) => response.json())
            .then((json) => json);
    }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:api')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('api') declare altName: ApiService`.
declare module '@ember/service' {
    interface Registry {
        api: ApiService;
    }
}
