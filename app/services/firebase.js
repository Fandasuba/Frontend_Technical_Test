import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore'; //FIrebase syntax stuff for getting schemas, setting up server connection, then creating and retrieving documents from the server.
import config from 'ember-quickstart/config/environment';
import Service from '@ember/service';

export default class FirebaseService extends Service {
  // ember uses classes in OOP, so extends is grabbing the ember service syntax and extending it.
  db = config.environment === 'test' ? undefined : getFirestore();

  async addMovie(title, description) {
    await addDoc(collection(this.db, 'movies'), { description, title });
  }

  async getMovies() {
    console.log('getMovies called');
    try {
      const movieDatabase = collection(this.db, 'movies');
      console.log('Accessing movies collection');
      const fetchedMovies = await getDocs(movieDatabase);
      console.log('Fetched movies:', fetchedMovies);
      return fetchedMovies.docs;
    } catch (error) {
      console.error('Error fetching movies', error);
      return [];
    }
  }

  async deleteMovie(movieId) {
    try {
      const movieRef = doc(this.db, 'movies', movieId);
      await deleteDoc(movieRef);
    } catch (error) {
      console.error("Can't delete movie:", error);
    }
  }

  async updateMovie(movieId, updates) {
    console.log(movieId, updates);
    try {
      const movieRef2 = doc(this.db, 'movies', movieId);
      await updateDoc(movieRef2, updates);
    } catch (error) {
      console.error('error updating film:', error);
    }
  }
}
