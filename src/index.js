import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import NavigationScroll from 'components/UI/NavigationScroll';
import { Provider } from 'react-redux';
import store from './store/index';

ReactDOM.render(
	<BrowserRouter>
		<NavigationScroll />
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
);
