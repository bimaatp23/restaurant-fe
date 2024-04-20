import { module, test } from 'qunit';
import { setupTest } from 'restaurant-fe/tests/helpers';

module('Unit | Service | cart', function (hooks) {
    setupTest(hooks);

    // TODO: Replace this with your real tests.
    test('it exists', function (assert) {
        const service = this.owner.lookup('service:cart');
        assert.ok(service);
    });
});
