import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollTop';
import { Provider } from 'react-redux';
import store from './store/index';

ReactDOM.render(
    <BrowserRouter>
        <ScrollToTop/>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>, 
document.getElementById('root'));
