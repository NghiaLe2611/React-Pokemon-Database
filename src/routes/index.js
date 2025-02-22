import Footer from '@/components/UI/Footer';
import Loadable from '@/components/UI/Loadable';
import Navigation from '@/components/UI/Navigation';
import Root from '@/components/UI/Root';
import { PokemonProvider } from '@/contexts/PokemonContext';
import NotFound from '@/pages/NotFound';
import { createRef, lazy } from 'react';
import { useRoutes } from 'react-router';
import { useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

const HomePage = Loadable(lazy(() => import('@/pages/home')));
const PokemonDetail = Loadable(lazy(() => import('@/pages/detail')));
const PokemonType = Loadable(lazy(() => import('@/pages/types')));
const PokemonMove = Loadable(lazy(() => import('@/pages/moves')));

const routes = [
    {
        path: '/',
        element: <Root />,
        children: [
            { path: '/', element: <PokemonProvider><HomePage replace index /></PokemonProvider>, nodeRef: createRef() },
            {
                path: '/pokedex', element: <PokemonProvider><HomePage /></PokemonProvider>, nodeRef: createRef() },
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
                path: '/pokemon/move/:pokemonMove',
                element: <PokemonMove />,
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
