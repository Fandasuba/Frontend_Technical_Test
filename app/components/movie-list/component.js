import Component from '@glimmer/component';
import podNames from 'ember-component-css/pod-names';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MovieList extends Component {
  @service firebase;
  @tracked movies = [];
  styleNamespace = podNames['movie-list'];

  constructor() {
    super(...arguments);
    this.loadMovies();
  }

  @action
  async loadMovies() {
    try {
      console.log('Loading movies...');
      const movies = await this.firebase.getMovies();
      console.log('Movies loaded:', movies);
      this.movies = movies;
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }
  @action
  async refreshMovies() {
    await this.loadMovies();
  }
}
