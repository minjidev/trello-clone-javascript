import renderDOM from './renderDOM.js';

class Component {
  $target;

  state;

  constructor($target, props) {
    this.$target = $target;
    this.props = props;
    this.setup();
    this.setEvent();
    this.render();
  }

  setup() {}

  mounted() {}

  template() {
    return '';
  }

  render() {
    this.$target.innerHTML = this.template();
    this.mounted(); // render 후에 실행
  }

  setEvent() {}

  addEvent(eventType, selector, callback) {
    const children = [...this.$target.querySelectorAll(selector)];

    this.$target.addEventListener(eventType, event => {
      if (!event.target.closest(selector)) return false;
      callback(event);
    });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    console.log('[STATE]:', this.state);
    this.render();
  }
}

export default Component;
