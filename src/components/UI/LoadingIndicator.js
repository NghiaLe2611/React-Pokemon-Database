import classes from '../../scss/LoadingIndicator.module.scss';

const LoadingIndicator = () => {
    return (
        <div className={classes.loading}>
            <div className={classes.loader}></div>
        </div>
    )
};

export default LoadingIndicator;