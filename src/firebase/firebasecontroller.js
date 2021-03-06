import {
  logOut, loginGoogle, loginUser,
} from './auth.js';

export const logOutEvent = () => {
  logOut().then(() => {
    window.location.assign('#/');
    console.log('¡Se cerró, lo logramos!');
  });
};
export const loginGoogleEvent = (errorContainer) => {
  loginGoogle()
    .then(() => {
      window.location.hash = '#/timeline';
    })
    .catch((error) => {
      const templateError = `<div class="modal-error"><p>Hubo un problema: ${error.message}</p></div>`;
      errorContainer.innerHTML = templateError;
    });
};
export const loginUserEvent = (user, password, errorContainer) => {
  loginUser(user, password)
    .then(() => {
      window.location.assign('#/timeline');
    })
    .catch((error) => {
      const templateError = `<div class="modal-error"><p>Hubo un problema: ${error.message}</p></div>`;
      errorContainer.innerHTML = templateError;
    });
};
