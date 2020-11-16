import MockFirebase from 'mock-cloud-firestore';

const fixtureData = {
  __collection__: {
    posts: {
      __doc__: {
        abc1d: {
          comentario: 'hola viajero'
        },
      },
    },
  },
};

global.firebase = new MockFirebase(fixtureData, { isNaiveSnapshotListenerEnabled: true, });
import { crud } from '../src/firebase/funcionesGenerales.js';

describe('Agregar post', () => {
  it('should add post', (done) => {
    const data = {
      comentario: 'comentario',
      displayName: 'name',
      photoURL: 'http://',
    }
    // en firestore  no existe un post con el comentario `comentario`
    firebase.firestore().collection('posts').get()
      .then((result) => {
        console.log(result._data);
        expect(result._data.filter((p) => p._data.comentario === data.comentario).length).toBe(0);
        return crud.addPost(data)      
      })
      .then((docRef) => {
        // en firestore existe un post con el comentario `comentario`
        return firebase.firestore().collection('posts').get()
      })
      .then((result2) => {
        expect(result2._data.filter((p) => p._data.comentario === data.comentario).length).toBe(1);
        done();
      });
  });
});

 describe('Edit a post', () => {
  it('Should edit a post', (done) => {
    const dato = {
      comentario: 'hola viajero, gracias por venir'
    }
      return crud.editar('abc1d', dato)
        .then(() => firebase.firestore().collection('posts').get())
        .then((querySnapshot) => {
          const result = querySnapshot._data.find((posts) => posts._data.comentario === 'hola viajero, gracias por venir');
          console.log(result);
          expect(result._data.comentario).toBe('hola viajero, gracias por venir');
          done();
      }); 
  });
}); 
 describe('Delete a post', () => {
  it('Should delete a post', (done) => {
    const dato = {
      comentario: 'hola viajero, gracias por venir'
    }
      return crud.eliminar('abc1d', dato)
        .then(() => firebase.firestore().collection('posts').get())
        .then((querySnapshot) => {
          const result = querySnapshot._data.find((posts) => posts._data.id === 'hola viajero, gracias por venir');
          expect(result).toBe(undefined);
          done()
        });
  });
});
 