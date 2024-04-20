import { module, test } from 'qunit';
import { setupTest } from 'restaurant-fe/tests/helpers';

module('Unit | Service | order', function (hooks) {
    setupTest(hooks);

    // TODO: Replace this with your real tests.
    test('it exists', function (assert) {
        const service = this.owner.lookup('service:order');
        assert.ok(service);
    });
});
