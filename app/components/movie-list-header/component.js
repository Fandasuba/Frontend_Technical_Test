import Component from '@glimmer/component'; /// Ember component class object.
import { tracked } from '@glimmer/tracking';
import podNames from 'ember-component-css/pod-names';
import { inject as service } from '@ember/service';

export default class MovieListHeader extends Component {
  // creates a new component name for our component library via extending it from the Component ember JS syntax object thing.
  @service firebase; // Inject the Firebase service
  @tracked movies = []; // Track the movies array for reactivity
  styleNamespace = podNames['movie-list-header'];
  constructor() {
    super(...arguments);
    this.movieCards();
  }

  async movieCards() {
    try {
      const fetchedMovies = await this.firebase.getMovies();
      this.movies = fetchedMovies;
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }
}
