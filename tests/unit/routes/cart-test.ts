import { module, test } from 'qunit';
import { setupTest } from 'restaurant-fe/tests/helpers';

module('Unit | Route | cart', function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
        const route = this.owner.lookup('route:cart');
        assert.ok(route);
    });
});
