import NavigationScroll from '@/components/UI/NavigationScroll';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/scss/main.scss';

const queryClient = new QueryClient();

// const persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<NavigationScroll>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</NavigationScroll>
	</BrowserRouter>,
);