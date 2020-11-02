import { components } from '../view/index.js';

const changeView = (route) => {
  const container = document.getElementById('container');
  container.innerHTML = '';
  switch (route) {
    case '': {
      return container.appendChild(components.sesion());
    }
    case '#/': {
      return container.appendChild(components.sesion());
    }
    case '#/registro': {
      return container.appendChild(components.registro());
    }
    case '#/timeline': {
      return container.appendChild(components.timeline());
    }
    default:
      return container.appendChild(components.different());
  }
};

export { changeView };
