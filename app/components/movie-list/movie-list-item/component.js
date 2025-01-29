import Component from '@glimmer/component';
import podNames from 'ember-component-css/pod-names';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MovieListItem extends Component {
  @service firebase;
  @tracked isEditing = false;
  @tracked editTitle;
  @tracked editDescription;
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

  @action
  startEditing() {
    this.isEditing = true;
    this.editTitle = this.movie.title;
    this.editDescription = this.movie.description;

    console.log(this.editTitle);
    console.log(this.editDescription);
  }
  @action
  async saveEdit() {
    try {
      await this.firebase.updateMovie(this.args.movie.id, {
        title: this.editTitle,
        description: this.editDescription,
      });
      this.isEditing = false;
      this.args.onRefresh();
      console.log(
        this.args.onRefresh(),
        'Logging the saveEdit action for the onRefresh.',
      );
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  }

  @action
  cancelEdit() {
    this.isEditing = false;
  }

  @action
  async deleteMovie() {
    try {
      await this.firebase.deleteMovie(this.args.movie.id);
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  }
}
