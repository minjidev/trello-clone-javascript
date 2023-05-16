import diff from './diff.js';

let component = null;
let root = null;

const renderDOM = (Component, $root) => {
  if (Component) {
    root = $root;
    component = new Component();
    root.innerHTML = component.render();
  }

  const createNewTree = () => {
    const cloned = root.cloneNode(true);
    cloned.innerHTML = component.render();
    return cloned;
  };

  const newTree = createNewTree();
  diff(root, newTree);
};

export default renderDOM;
