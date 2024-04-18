import { module, test } from 'qunit';
import { setupTest } from 'restaurant-fe/tests/helpers';

module('Unit | Route | profile', function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
        const route = this.owner.lookup('route:profile');
        assert.ok(route);
    });
});
