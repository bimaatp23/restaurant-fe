import Service from '@ember/service';

export default class ApiService extends Service {
  endpoint: string = 'http://localhost:3000';

  async getBasic(url: string): Promise<any> {
    return await fetch(this.endpoint + '/api/' + url)
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
