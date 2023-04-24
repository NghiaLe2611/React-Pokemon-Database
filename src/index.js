import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import store from './store/index';
import NavigationScroll from 'components/UI/NavigationScroll';

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<NavigationScroll>
				<App />
			</NavigationScroll>
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);
