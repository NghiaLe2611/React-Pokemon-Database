import Layout from './components/UI/Layout';
import PokemonMainPage from './pages/PokemonList';
import PokemonDetail from './pages/PokemonDetail';
import PokemonType from './pages/PokemonType';
import NotFound from './pages/NotFound';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PokemonList from './components/List/PokemonList';
import PokemonTableList from './components/Table/PokemonTableList';


// import { useState, useEffect } from 'react';

// function getPathDepth(location) {
//     let pathArr = location.split("/");
//     pathArr = pathArr.filter(n => n !== "");
//     return pathArr.length;
// }

function App() {
    const location = useLocation();

    // const [pageDirection, setPageDirection] = useState('');
    // const [currentPath, setCurrentPath] = useState(location.pathname)

    let query = new URLSearchParams(location.search);

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
                    <Switch location={location}>
                        <Route path="/" exact>
                            <Redirect to="/pokedex" />
                        </Route>
                        <Route path="/pokedex" exact>
                            <PokemonMainPage/>
                        </Route>
                        <Route path="/list" exact>
                            <PokemonList/>
                        </Route>
                        <Route path="/table" exact>
                            <PokemonTableList/>
                        </Route>
                        <Route path="/pokemon/:pokemonId" exact>
                            <PokemonDetail/>
                        </Route>
                        <Route path="/pokemon/type/:pokemonType">
                            <PokemonType/> 
                        </Route>
                        <Route path="*">
                            <NotFound type={query.get("type")}/>
                        </Route>
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </Layout>        
	);
}

export default App;
