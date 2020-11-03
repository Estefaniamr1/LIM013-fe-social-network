import MockFirebase from 'mock-cloud-firestore';

const fixtureData = {
  __collection__: {
    publications: {
      __doc__: {
        abc1d: {
          note: 'hola viajero'
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
        console.log(result.data);
        expect(Object.values(result.data).filter((p) => p.comentario === data.comentario).length).toBe(0);
        return crud.addPost(data)      
      })
      .then((docRef) => {
        // en firestore existe un post con el comentario `comentario`
        return firebase.firestore().collection('posts').get()
      })
      .then((result2) => {
        expect(Object.values(result2.data).filter((p) => p.comentario === data.comentario).length).toBe(1);
        done();
      });
  });
});
 
describe('Edit a post', () => {
  it('Should edit a post', (done) => {
    return crud.editar('abc1d', 'hola viajero, gracias por venir')
      .then(() => firebase.firestore().collection('posts').get()(
        (data) => {
          const result = data.find((element) => element.note === 'hola viajero, gracias por venir');
          expect(result.note).toBe('hola viajero, gracias por venir');
          done();
        },
      ));
  });
});

describe('Delete a post', () => {
  it('Should delete a post', (done) => {
    return deletePost('abc1d')
      .then(() => firebase.firestore().collection('posts').get()(
        (data) => {
          const result = data.find((element) => element.id === 'abc1d');
          expect(result).toBe(undefined);
          done();
        },
      ));
  });
});

/* describe('Edit a post', () => {
  it('Should edit a post', () => {
    const mockEdit = jest.fn();
  });
}); */