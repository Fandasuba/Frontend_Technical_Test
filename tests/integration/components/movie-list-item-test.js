import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | MovieListHeader', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // looked up online how we simulate our DB for testing purpose for the MVP for patching and del requests.
    this.movie = {
      id: '123',
      data() {
        return {
          title: 'TEST TITLE',
          description: 'TEST DESCRIPTION',
        };
      },
    };

    this.owner.register('service:firebase', {
      updateMovie: async function (id, updates) {
        // code that simulates how I've setup the firebase.js file for patching and delete requests.
        this.lastUpdates = { id, updates };
      },
      deleteMovie: async function (id) {
        this.lastDeletedId = id;
      },
    });
  });

  test('has the correct header text', async function (assert) {
    this.movie = { title: 'TEST TITLE', description: 'TEST DESCRIPTION' };
    await render(hbs`<MovieList::MovieListItem @movie={{this.movie}} />`);

    assert.dom('h2').hasText('TEST TITLE');
    assert.dom('p').hasText('TEST DESCRIPTION');
  }); // I presumed not to change the test so i added some functionality for raw data so the test could pass.

  test('renders Firebase movie data correctly', async function (assert) {
    // added an extra test as I wanted to see how testing for firebase .data() would work
    this.movie = {
      data() {
        return {
          title: 'FIREBASE TITLE',
          description: 'FIREBASE DESCRIPTION',
        };
      },
    };
    await render(hbs`<MovieList::MovieListItem @movie={{this.movie}} />`);
    assert.dom('h2').hasText('FIREBASE TITLE');
    assert.dom('p').hasText('FIREBASE DESCRIPTION');
  });
});
