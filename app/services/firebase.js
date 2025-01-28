import { addDoc, collection, getFirestore, getDocs } from 'firebase/firestore'; //FIrebase syntax stuff for getting schemas, setting up server connection, then creating and retrieving documents from the server.
import config from 'ember-quickstart/config/environment';
import Service from '@ember/service';

export default class FirebaseService extends Service {
  // ember uses classes in OOP, so extends is grabbing the ember service syntax and extending it.
  db = config.environment === 'test' ? undefined : getFirestore();

  async addMovie(title, description) {
    await addDoc(collection(this.db, 'movies'), { description, title });
  }

  async getMovies() {
    // new function
    try {
      const movieDatabase = collection(this.db, 'movies'); // grabbing that movies scheme that was already created by Clarus and inserting it into a variable.
      const fetchedMovies = await getDocs(movieDatabase); // GET request for the movies schema stored in a pure function.

      // I learned here that the endless . donation for console logging the fetchedMovies variable was an eye sore. I learned the film.data() command broke it down. Thanks firebase/firestore.

      // fetchedMovies.docs.forEach((film) => {
      //   console.log('Document ID:', film.id);
      //   console.log('Full document:', film.data());
      // });

      return fetchedMovies.docs.map((film) => ({
        id: film.id,
        ...film.data(),
      }));
    } catch (error) {
      console.error('Error fetching movies', error);
      return [];
    }
  }
}
