/* eslint-disable import/extensions */
import App from './app.js';
import renderDOM from './core/renderDOM.js';

// renderDOM(App, document.getElementById('root'));
new App(document.querySelector('#root'));
