import classes from '../../scss/SkeletonElement.module.scss';
const SkeletonElement = ({ type }) => {
    return (
        <div className={`${classes.skeleton} ${classes[type]}`}></div>
    )
};

export default SkeletonElement;