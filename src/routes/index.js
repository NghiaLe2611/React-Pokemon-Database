import { lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router';
import Loadable from 'components/UI/Loadable';

const HomePage = Loadable(lazy(() => import('pages/home')));
const PokemonDetail = Loadable(lazy(() => import('pages/detail')));
const PokemonType = Loadable(lazy(() => import('pages/type')));

const AppRoutes = () => {
	// const location = useLocation();
	// const query = new URLSearchParams(location.search);

	return (
		<Routes>
			<Route path='/' element={<Navigate to='/pokedex' replace />} />
			<Route path='/pokedex' element={<HomePage />} />
			<Route path='/pokemon/:pokemonId' exact element={<PokemonDetail />} />
            <Route path='/pokemon/type/:pokemonType' exact element={<PokemonType />} />
		</Routes>
	);
};

export default AppRoutes;

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
