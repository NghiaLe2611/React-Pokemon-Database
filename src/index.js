import NavigationScroll from 'components/UI/NavigationScroll';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// import './index.css';
import 'scss/main.scss';

// const persistor = persistStore(store);

ReactDOM.render(
	// <Provider store={store}>
	// 	<BrowserRouter>
	// 		<NavigationScroll>
	// 			<PersistGate loading={null} persistor={persistor}>
	// 				<App />
	// 			</PersistGate>
	// 		</NavigationScroll>
	// 	</BrowserRouter>
	// </Provider>,
	<BrowserRouter>
		<NavigationScroll>
			<App />
		</NavigationScroll>
	</BrowserRouter>,
	document.getElementById('root')
);
