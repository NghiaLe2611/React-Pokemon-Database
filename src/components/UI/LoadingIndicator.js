import classes from '../../scss/LoadingIndicator.module.scss';

const LoadingIndicator = (props) => {
    return (
        <div className={`${classes.loading} ${props.type === 'fixed' ? classes['fixed-loader'] : ''}`}>
            <div className={classes.loader}></div>
        </div>
    )
};

export default LoadingIndicator;