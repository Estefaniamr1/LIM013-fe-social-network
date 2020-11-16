export const createUserAccount = (usuarioSignUp, passwordSignUp) => firebase.auth()
  .createUserWithEmailAndPassword(usuarioSignUp, passwordSignUp);

let currentUser = {};

export const tryAuth = () => {
  firebase.auth().onAuthStateChanged((userCB) => {
    if (userCB) {
      currentUser = userCB;
    }
  });
};

export const getCurrentUser = () => currentUser;

export const loginUser = (usuarioSignIn, passwordSignIn) => firebase
  .auth()
  .signInWithEmailAndPassword(usuarioSignIn, passwordSignIn);

export const loginGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
};

export const logOut = () => firebase.auth().signOut();
