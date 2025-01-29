import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import podNames from 'ember-component-css/pod-names';
import { inject as service } from '@ember/service';

export default class AddMovieForm extends Component {
  styleNamespace = podNames['add-movie-form'];
  @service firebase;
  @service movieListManager; // see the note on the MovieList component.
  @tracked description;
  @tracked title;
  @tracked errorMessage;

  @action
  async addMovie(event) {
    event.preventDefault();
    console.log('Attempting to add movie:', {
      title: this.title,
      description: this.description,
    });

    this.errorMessage = undefined;
    try {
      const { description, title } = this;
      await this.firebase.addMovie(title, description);
      console.log('Successfully added movie to Firebase');
      this.description = undefined;
      this.title = undefined;
      await this.movieListManager.triggerLoadMovies();
    } catch (error) {
      console.log('Error adding movie to the Firebase database:', error);
      this.errorMessage = error?.message;
    }
  }
}
