import classes from '../../scss/Footer.module.scss';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <p className={classes['copy-right']}>&copy;2021. React Pokemon Database-Nghia Le. All right reserved.</p>
                <p className={classes.reference}>
                    Source: <a rel="noreferrer" target="_blank" href="https://pokeapi.co/">https://pokeapi.co/</a>, &nbsp;
                    <a rel="noreferrer" target="_blank" href="https://www.pokemon.com/us/pokedex/">https://www.pokemon.com/us/pokedex/</a>, &nbsp;
                    <a rel="noreferrer" target="_blank" href="https://pokemondb.net/">https://pokemondb.net/</a>
                </p>
            </div>
        </footer>
    )
}

export default Footer;