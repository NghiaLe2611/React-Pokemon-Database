import { Fragment, createRef, lazy } from 'react';
import { useRoutes } from 'react-router';
import { useLocation } from 'react-router-dom';
import Loadable from 'components/UI/Loadable';
import Root from 'components/UI/Root';
import NotFound from 'pages/NotFound';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Navigation from 'components/UI/Navigation';
import Footer from 'components/UI/Footer';

const HomePage = Loadable(lazy(() => import('pages/home')));
const PokemonDetail = Loadable(lazy(() => import('pages/detail')));
const PokemonType = Loadable(lazy(() => import('pages/type')));

const routes = [
	{
		path: '/',
		element: <Root />,
		children: [
			{ path: '/', element: <HomePage replace index/>, nodeRef: createRef() },
			{ path: '/pokedex', element: <HomePage />, nodeRef: createRef() },
			{
				path: '/pokemon/:pokemonId',
				element: <PokemonDetail />,
				nodeRef: createRef(),
				exact: true,
			},
			{
				path: '/pokemon/type/:pokemonType',
				element: <PokemonType />,
				nodeRef: createRef(),
				exact: true,
			},
			{
				path: '*',
				element: <NotFound />,
				nodeRef: createRef(),
			},
		],
	},
];

const AppRoutes = () => {
	const location = useLocation();
	const element = useRoutes(routes);

	return (
		<>
			<Navigation />
			<SwitchTransition>
				<CSSTransition key={location.key} classNames='fade' timeout={300} unmountOnExit>
					<main>
						<div className='container'>{element}</div>
					</main>
				</CSSTransition>
			</SwitchTransition>
			<Footer />
		</>
	);
};

export default AppRoutes;

// const router = createBrowserRouter(
// 	createRoutesFromElements(
// 		<Route path='/' element={<RootLayout />}>
// 			<Route index element={<Home />} />
// 			<Route path='about' element={<About />} />
// 		</Route>
// 	)
// );

// function getPathDepth(location) {
//     let pathArr = location.split("/");
//     pathArr = pathArr.filter(n => n !== "");
//     return pathArr.length;
// }

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

{
	/* <Switch location={location}>
    <Route path='/' exact>
        <Redirect to='/pokedex' />
    </Route>
    <Route path='/pokedex' exact>
        <PokemonMainPage />
    </Route>
    <Route path='/list' exact>
        <PokemonList />
    </Route>
    <Route path='/table' exact>
        <PokemonTableList />
    </Route>
    <Route path='/pokemon/:pokemonId' exact>
        <PokemonDetail />
    </Route>
    <Route path='/pokemon/type/:pokemonType'>
        <PokemonType />
    </Route>
    <Route path='*'>
        <NotFound type={query.get('type')} />
    </Route>
</Switch> */
}
