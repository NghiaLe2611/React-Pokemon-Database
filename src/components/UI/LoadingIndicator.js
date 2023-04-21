import classes from '../../scss/LoadingIndicator.module.scss';

const LoadingIndicator = ({type}) => {
    return (
        <div className={`${classes.loading} ${type === 'fixed' ? classes['fixed-loader'] : ''}`}>
            <div className={classes.loader}></div>
        </div>
    )
};

export default LoadingIndicator;