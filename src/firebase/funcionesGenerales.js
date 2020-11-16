const getDb = () => firebase.firestore();

export const getDataSnapshot = (collection, querySnapshot) => {
  getDb().collection(collection).orderBy('date', 'desc').onSnapshot(querySnapshot);
};

const crud = {
  eliminar(id) {
    return getDb()
      .collection('posts')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Document successfuly deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  },

  editar(id, data) {
    return getDb()
      .collection('posts')
      .doc(id)
      .update(data)
      .then(() => {
        console.log('Document successfuly edited!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  },

  addPost(data) {
    return getDb()
      .collection('posts')
      .add(data)
      .then(docRef => docRef)
      .catch((error) => {
        console.log(error);
      });
  },
  async updateImage(imagesUpload, nameUser) {
    const storageRef = firebase.storage().ref();
    try {
      const uploadResult = await storageRef
        .child(`images/${imagesUpload.name}`)
        .put(imagesUpload);
      const downloadUrl = await uploadResult.ref.getDownloadURL();
      await firebase.auth().currentUser.updateProfile({
        photoURL: downloadUrl,
        displayName: nameUser,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export { crud };
