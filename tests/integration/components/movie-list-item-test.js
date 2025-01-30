import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, findAll } from '@ember/test-helpers';
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

  test('deleting a movie from the list', async function (assert) {
    this.movies = [
      // expect an array
      {
        id: 123,
        title: 'Craig Test',
        description: 'Testing if it is deleted',
      },
    ];

    let deleteWasCalled = false; // boolean for later testing.

    const firebaseStub = Service.extend({
      deleteMovie: async (id) => {
        // doesn't actually use the firebase delete function, instead it mocks it, and we use the filter below to imitate it
        deleteWasCalled = true;
        assert.equal(id, 123, 'Correct movie ID was passed to delete function');
        this.set(
          'movies',
          this.movies.filter((movie) => movie.id !== id),
        );
        return Promise.resolve();
      },
    });

    this.owner.register('service:firebase', firebaseStub);

    await render(hbs`
      {{#each this.movies as |movie|}}
        <MovieList::MovieListItem @movie={{movie}} />
      {{/each}}
    `); // tells the ember handlebars to remap like it expect with the optimistic rendering I made.

    assert
      .dom('h2')
      .hasText('Craig Test', 'Movie title is initially displayed');
    assert
      .dom('p')
      .hasText(
        'Testing if it is deleted',
        'Movie description is initially displayed',
      );
    assert.dom('.delete-button').exists('Delete button is present');
    await click('.delete-button');

    assert.true(deleteWasCalled, 'Delete function was called');
    assert.dom('h2').doesNotExist('Movie title is removed after deletion');
    assert.dom('p').doesNotExist('Movie description is removed after deletion');
  });

  test('testing that it returns the array of movies after one movie was deleted', async function (assert) {
    this.movies = [
      { id: 123, title: 'Spider Man 1', description: 'Spider Man 1 film' },
      { id: 456, title: 'Spider Man 2', description: 'Spider Man 2 film' },
      { id: 789, title: 'Spider Man 3', description: 'Spider Man 3 film' },
    ];

    let deleteWasCalled = false;
    const firebaseStub = Service.extend({
      deleteMovie: async (id) => {
        deleteWasCalled = true;
        assert.equal(id, 123, 'Aiming to delete Spider Man 1');
        this.set(
          'movies',
          this.movies.filter((movie) => movie.id !== id),
        );
        return Promise.resolve();
      },
    });

    this.owner.register('service:firebase', firebaseStub);

    await render(hbs`
      {{#each this.movies as |movie|}}
        <MovieList::MovieListItem @movie={{movie}} />
      {{/each}}
    `);

    await click('.delete-button');
    assert.true(deleteWasCalled);

    const reRenderedTitles = findAll('h2').map((movie) =>
      movie.textContent.trim(),
    );
    const reRenderedDescriptions = findAll('p').map((movie) =>
      movie.textContent.trim(),
    );

    console.log('Re Rendered Titles:', reRenderedTitles);
    console.log('Re Rendered Descriptions:', reRenderedDescriptions);

    assert.deepEqual(
      reRenderedTitles,
      ['Spider Man 2', 'Spider Man 3'],
      'Titles match after deletion',
    );
    assert.deepEqual(
      reRenderedDescriptions,
      ['Spider Man 2 film', 'Spider Man 3 film'],
      'Descriptions match after deletion',
    );
  });
});
