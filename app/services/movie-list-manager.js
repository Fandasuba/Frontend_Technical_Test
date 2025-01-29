import Service from '@ember/service';

export default class MovieListManagerService extends Service {
  loadMoviesCallback = null;

  registerLoadMovies(callback) {
    this.loadMoviesCallback = callback;
  }

  async triggerLoadMovies() {
    if (this.loadMoviesCallback) {
      await this.loadMoviesCallback();
    }
  }
}
