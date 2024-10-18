import 'bootstrap/dist/css/bootstrap.min.css';  // Importa o CSS do Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Importa o JS do Bootstrap (inclui o Popper.js)
import './app.css';
import App from './App.svelte';

const app = new App({
    target: document.getElementById('app'),
});

export default app;
