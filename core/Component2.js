import renderDOM from './renderDOM.js';

class Component {
  $target;

  state;

  constructor($target, props) {
    this.$target = $target;
    this.props = props;
    this.setup();
    this.bindEvent();
  }

  setup() {}

  render() {
    return this.template();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    console.log('[STATE]:', this.state);
    renderDOM();
  }

  bindEvent(eventType, selector, callback) {
    // const children = [...this.$target.querySelectorAll(selector)];
    this.$target.addEventListener(eventType, event => {
      if (!event.target.closest(selector)) return false;
      callback(event);
    });
  }
}

export default Component;
