import Component from '@glimmer/component';
import podNames from 'ember-component-css/pod-names';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
// import styles from './styles.scss';

export default class MovieListItem extends Component {
  @service firebase;
  @service movieListManager;
  @tracked isEditing = false;
  @tracked editTitle;
  @tracked editDescription;
  @service tmdb;
  @tracked trailerUrl = null;
  styleNamespace = podNames['movie-list/movie-list-item'];
  // styles = styles;

  constructor() {
    super(...arguments);
    this.loadTrailer();
  }
  async loadTrailer() {
    const title = this.movie.title;
    console.log(title, 'title in component');
    this.trailerUrl = await this.tmdb.getTrailerForMovie(title);
    console.log(this.trailerUrl, 'Inside loadTrailer in movie item');
  }
  get embedUrl() {
    if (!this.trailerUrl) return null;
    const videoId = this.trailerUrl.split('v=')[1];
    console.log(videoId, 'videoID');
    return `https://www.youtube.com/embed/${videoId}`;
  }

  get movie() {
    if (this.args.movie && typeof this.args.movie.data === 'function') {
      return this.args.movie.data();
    }
    return this.args.movie;
  }

  @action
  startEditing() {
    this.isEditing = true;
    this.editTitle = this.movie.title;
    this.editDescription = this.movie.description;
    console.log('Starting edit:', {
      title: this.editTitle,
      description: this.editDescription,
    });
  }

  @action
  async saveEdit() {
    console.log('Saving edit for movie:', this.args.movie.id);
    try {
      await this.firebase.updateMovie(this.args.movie.id, {
        title: this.editTitle,
        description: this.editDescription,
      });
      this.isEditing = false;
      await this.movieListManager.triggerLoadMovies();
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  }

  @action
  cancelEdit() {
    this.isEditing = false;
  }

  @action
  async deleteMovie() {
    console.log('Deleting movie:', this.args.movie.id);
    try {
      await this.firebase.deleteMovie(this.args.movie.id);
      await this.movieListManager.triggerLoadMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  }
}
