import NavigationScroll from '@/components/UI/NavigationScroll';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@/scss/main.scss';

// const persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<NavigationScroll>
			<App />
		</NavigationScroll>
	</BrowserRouter>,
);

