import { Link } from 'react-router-dom';
import classes from '../../scss/Navigation.module.scss';

const Navigation = () => {
    return (
        <header className={classes.header}>
             <h1 className={classes.title}>
                <Link to="/">React Pokédex</Link>
            </h1>
        </header>
    )
}

export default Navigation;