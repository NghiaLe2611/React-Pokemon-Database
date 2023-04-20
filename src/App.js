import Layout from './components/UI/Layout';
import PokemonMainPage from './pages/home';
import PokemonDetail from './pages/detail';
import PokemonType from './pages/type';
import NotFound from './pages/NotFound';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PokemonList from './components/List/PokemonList';
import PokemonTableList from './components/Table/PokemonTableList';
import AppRoutes from 'routes';

// import { useState, useEffect } from 'react';

// function getPathDepth(location) {
//     let pathArr = location.split("/");
//     pathArr = pathArr.filter(n => n !== "");
//     return pathArr.length;
// }

function App() {

	// const [pageDirection, setPageDirection] = useState('');
	// const [currentPath, setCurrentPath] = useState(location.pathname)
	const location = useLocation();
	const query = new URLSearchParams(location.search);

	// useEffect(() => {
	//     const newPath = location.pathname;
	//     if (newPath !== currentPath) {
	//         if (getPathDepth(newPath) - getPathDepth(currentPath) > 0) {
	//             setPageDirection('left');
	//         } else {
	//             setPageDirection('right');
	//         }
	//     }

	// }, [currentPath, location.pathname]);

	return (
		<Layout>
			<TransitionGroup>
				{/* className={`wrap-transition ${pageDirection}`} */}
				<CSSTransition
					timeout={500}
					classNames='fade'
					key={location.key}
					mountOnEnter={false}
					unmountOnExit={true}
				>
					<AppRoutes />
				</CSSTransition>
			</TransitionGroup>
		</Layout>
	);
}

export default App;
