import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

class MovieData {
  @tracked title;
  @tracked description;

  constructor(title, description) {
    this.title = title;
    this.description = description;
  }
}

class FirebaseStub extends Service {
  movieData = {
    title: 'Test Movie',
    description: 'Test Description',
  };
  async updateMovie(id, updates) {
    this.movieData = { ...this.movieData, ...updates };
    return Promise.resolve();
  }
}

module('Integration | Component | MovieListHeader', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // adding in a simple firebase emulation to get around some of the firebase tests that the edit needs to do.
    this.owner.register('service:firebase', FirebaseStub);
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

  test('can edit movie details', async function (assert) {
    const movieData = new MovieData('Test Movie', 'Test Description');

    this.movie = {
      id: '123',
      data() {
        return movieData;
      },
    };

    // Mock the Firebase updateMovie to update our tracked data
    const firebaseStub = this.owner.lookup('service:firebase');
    firebaseStub.updateMovie = async (id, updates) => {
      movieData.title = updates.title;
      movieData.description = updates.description;
      return Promise.resolve();
    };

    await render(hbs`<MovieList::MovieListItem @movie={{this.movie}} />`);

    assert.dom('h2').hasText('Test Movie');
    assert.dom('p').hasText('Test Description');

    await click('.edit-button');
    await fillIn('input[type="text"]', 'Updated Movie');
    await fillIn('textarea', 'Updated Description');
    await click('.save-button');

    assert.dom('h2').hasText('Updated Movie');
    assert.dom('p').hasText('Updated Description');
  });

  test('can cancel editing', async function (assert) {
    this.movie = {
      id: '123',
      title: 'Original Movie',
      description: 'Original Description',
    };

    await render(hbs`<MovieList::MovieListItem @movie={{this.movie}} />`);

    await click('.edit-button');
    await fillIn('input[type="text"]', 'Changed Movie');
    await fillIn('textarea', 'Changed Description');
    await click('.cancel-button');

    assert.dom('h2').hasText('Original Movie');
    assert.dom('p').hasText('Original Description');
  });

  test('can cancel editing', async function (assert) {
    this.movie = {
      id: '123',
      title: 'Original Movie',
      description: 'Original Description',
    };

    await render(hbs`<MovieList::MovieListItem @movie={{this.movie}} />`);

    await click('.edit-button');
    await fillIn('input[type="text"]', 'Changed Movie');
    await fillIn('textarea', 'Changed Description');
    await click('.cancel-button');

    assert.dom('h2').hasText('Original Movie');
    assert.dom('p').hasText('Original Description');
  });
});
