import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TmdbService extends Service {
  @tracked trailerData = null;

  apiKey = '55b907bc7e3eddc086014a766fd8c843';
  baseUrl = 'https://api.themoviedb.org/3';

  async getTrailerForMovie(title) {
    const searchResponse = await fetch(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${title}`,
    );
    console.log(searchResponse);
    const searchData = await searchResponse.json();
    if (!searchData.results || searchData.results.length === 0) {
      console.log('No movies found for:', title);
      return null;
    } else {
      const isolateMovie = searchData.results[0];
      console.log(isolateMovie, 'IsolatedMovie');
      const findTrailer = await fetch(
        `${this.baseUrl}/movie/${isolateMovie.id}/videos?api_key=${this.apiKey}`,
      );
      console.log(findTrailer, 'FindTrailer');
      const videosData = await findTrailer.json();

      console.log('Videos data:', videosData);
      const trailer = videosData.results?.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube',
      );

      if (trailer) {
        console.log(trailer, 'Trailer');
        return `https://www.youtube.com/watch?v=${trailer.key}`;
      }
    }
    return null;
  }
  catch(error) {
    console.error('Error fetching trailer:', error);
    return null;
  }
}
