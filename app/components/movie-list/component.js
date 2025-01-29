import Component from '@glimmer/component';
import podNames from 'ember-component-css/pod-names';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MovieList extends Component {
  @service firebase;
  @service movieListManager; // Added this because sending onRefresh as a prop to the the form was causing the form to duplicate. Service seemed like a good way of creating importing a util function.
  @tracked movies = [];
  styleNamespace = podNames['movie-list'];
  @service router;

  constructor() {
    super(...arguments);
    this.loadMovies();
    this.movieListManager.registerLoadMovies(() => this.loadMovies());
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
}
