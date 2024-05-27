import ScrollToTop from '@/components/UI/ScrollToTop';
import { Helmet } from 'react-helmet';
import AppRoutes from '@/routes';

function App() {
	return (
		<>
			<Helmet>
				<title>React Pokédex</title>
			</Helmet>
			<ScrollToTop />
			<AppRoutes />
		</>
	);
}

export default App;
