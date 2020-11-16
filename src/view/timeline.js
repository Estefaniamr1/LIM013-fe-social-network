import { logOutEvent } from '../firebase/firebasecontroller.js';
import { crud, getDataSnapshot } from '../firebase/funcionesGenerales.js';
import { getCurrentUser } from '../firebase/auth.js';


export default () => {
  const contenidoTimeline = `
  <div id="Pantalla">
    <div id="cabecera">
      <img id="imageProfile" src='images/user.png'/>
      <div class="logotipoTimeline"><img src="images/logo-RedSocial.png"></div>
      <button type="submit" id="buttonLogout">Cerrar sesión</button>
    </div>
    <div class="hide" id="modalProfile">
      <div class="modal">
        <h2>Profile</h2>
        <div class="updateData">
          <input type="text" placeholder="Update name" name="name" id="nameUser" />
          <input type="file" id="fotoUser" class="hide" />
          <label for="fotoUser" id="selector" class="labelUpdatePhoto"> 
          </label>
          <div id="preview"></div>
        </div>
        <button id="updateButton">Update</button>
        <span id="modalClose" class="modalClose">x</span>
      </div>
    </div>
    <div class="prepost">
      <input type="text" placeholder="¿Como te sientes hoy?" id="postUser">
      <button type="submit" id="sendPost">Publicar</button>
    </div>
    <div id="tabla">
    </div>
  </div>`;

  const divElem = document.createElement('div');
  divElem.innerHTML = contenidoTimeline;

  const modalProfile = divElem.querySelector('#modalProfile');
  const modalClose = divElem.querySelector('#modalClose');
  const imageProfile = divElem.querySelector('#imageProfile');
  const fotoUser = divElem.querySelector('#fotoUser');
  const buttonLogout = divElem.querySelector('#buttonLogout');
  const postUser = divElem.querySelector('#postUser');
  const sendPost = divElem.querySelector('#sendPost');
  const tabla = divElem.querySelector('#tabla');
  const updateButton = divElem.querySelector('#updateButton');
  const output = divElem.querySelector('#selector');
  const preview = divElem.querySelector('#preview');

  const loaderUpdate = (e) => {
    const file = e.target.files;
    const show = `<span class="fileSelected">Selected file: </span> ${file[0].name}`;
    output.innerHTML = show;

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      const image = document.createElement('img');
      image.src = reader.result;

      preview.innerHTML = '';
      preview.append(image);
    };
  };

  fotoUser.addEventListener('change', loaderUpdate);

  modalClose.addEventListener('click', () => {
    modalProfile.classList.add('hide');
    modalProfile.classList.remove('display');
    modalProfile.classList.remove('modalProfile');
  });
  imageProfile.addEventListener('click', () => {
    divElem.querySelector('#nameUser').value = getCurrentUser().displayName;
    modalProfile.classList.add('display');
    modalProfile.classList.add('modalProfile');
    modalProfile.classList.remove('hide');
    const show = `<span class="material-icons">add_photo_alternate</span>
    Choose a photo`;
    output.innerHTML = show;
    const image = document.createElement('img');
    image.src = getCurrentUser().photoURL;
    if (preview.childNodes[0]) {
      preview.replaceChild(image, preview.childNodes[0]);
    } else {
      preview.append(image);
    }
  });
  updateButton.addEventListener('click', () => {
    const imagesUpload = fotoUser.files[0];
    const nameUser = divElem.querySelector('#nameUser').value;
    crud.updateImage(imagesUpload, nameUser);

    modalProfile.classList.add('hide');
    modalProfile.classList.remove('display');
    modalProfile.classList.remove('modalProfile');
  });
  buttonLogout.addEventListener('click', logOutEvent);
  sendPost.addEventListener('click', () => {
    const messagePost = postUser.value;
    const dateToday = new Date();
    const data = {
      comentario: messagePost,
      displayName: getCurrentUser().displayName,
      photoURL: getCurrentUser().photoURL,
      userid: getCurrentUser().uid,
      date: dateToday,
    };
    console.log(data);
    crud.addPost(data);
    postUser.value = '';
  });
  getDataSnapshot('posts', (querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const fullDate = new Date(doc.data().date.seconds * 1000);
      const div = document.createElement('div');
      div.id = `db_${doc.id}`;
      div.innerHTML = `
      <div class="userData">
      <img src="${doc.data().photoURL}">
      <div class="postInfo">
        <label class="firstChild">${doc.data().displayName}</label>
        <label class="secondChild">${fullDate.getDate()}/${fullDate.getMonth() + 1}/${fullDate.getFullYear()}</label>
      </div>
      </div>
      <input value="${doc.data().comentario}" disabled class="postedMessage" id="postedMessage">
      <div class="buttonsData">
        <button>Editar</button>
        <button>Eliminar</button>
      </div>
      `;
      const buttonEliminar = div.querySelectorAll('button')[1];
      const buttonEditar = div.querySelectorAll('button')[0];
      const input = div.querySelector('input');
      if (!(doc.data().userid === getCurrentUser().uid)) {
        buttonEliminar.classList.add('hide');
        buttonEditar.classList.add('hide');
      }
      buttonEliminar.addEventListener('click', () => {
        crud.eliminar(doc.id);
      });
      buttonEditar.addEventListener('click', (e) => {
        const parentButton = e.target.parentNode;
        const parentDiv = parentButton.parentNode;
        const postedMessage = parentDiv.children[1];
        if (input.disabled) {
          postedMessage.classList.add('editing-post');
          input.disabled = false;
          buttonEditar.innerText = 'Guardar';
        } else {
          input.disabled = true;
          const data = {
            comentario: input.value,
          };

          postedMessage.classList.remove('editing-post');
          input.disabled = true;
          buttonEditar.innerText = 'Editar';

          crud.editar(doc.id, data);
        }
      });
      tabla.appendChild(div);
    });
  });
  return divElem;
};
