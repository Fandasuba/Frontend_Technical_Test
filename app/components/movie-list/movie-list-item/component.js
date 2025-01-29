import Component from '@glimmer/component';
import podNames from 'ember-component-css/pod-names';

export default class MovieListItem extends Component {
  styleNamespace = podNames['movie-list/movie-list-item'];

  // constructor() { // Console logs for checking if the info was getting from Firebase to this component.
  //   super(...arguments);
  //   console.log('MovieListItem received:', this.args.movie);
  //   console.log('Processed movie data:', this.args.movie.data());
  // }

  get movie() {
    if (this.args.movie && typeof this.args.movie.data === 'function') {
      // passing in via parent function
      return this.args.movie.data();
    }
    // Return for the test to pass since we are not passing in data from Firebase/store for the test. Not sure if it a good work around or not.
    return this.args.movie;
  }
}
