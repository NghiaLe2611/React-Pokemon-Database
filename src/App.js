import Layout from './components/UI/Layout';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import { Route, Switch, Redirect } from 'react-router-dom';

function App() {
	return (
		<Layout>
			<Switch>
				<Route path='/' exact>
					<Redirect to='/pokedex' />
				</Route>
				<Route path='/pokedex' exact>
					<PokemonList />
				</Route>
				<Route path='/pokemon/:pokemonId'>
					<PokemonDetail />
				</Route>
				<Route path='*'>
					<p>Not Found</p>
				</Route>
			</Switch>
		</Layout>
	);
}

export default App;
