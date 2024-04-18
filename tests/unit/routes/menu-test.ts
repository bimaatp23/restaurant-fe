import { module, test } from 'qunit';
import { setupTest } from 'restaurant-fe/tests/helpers';

module('Unit | Route | menu', function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
        const route = this.owner.lookup('route:menu');
        assert.ok(route);
    });
});
