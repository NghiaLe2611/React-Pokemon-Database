import React from "react";
import styles from "./Skeleton.module.scss"; // Import file CSS riêng

const PokemonSkeleton = () => {
    return (
        <div className={styles.skeletonContainer}>
            {/* Skeleton Image */}
            <div className={styles.skeletonImage}></div>

            {/* Skeleton Info */}
            <div className={styles.skeletonInfo}>
                <div className={styles.skeletonText} style={{ width: "50px" }}></div>
                <div className={styles.skeletonText} style={{ width: "120px", height: "20px" }}></div>

                {/* Skeleton Types */}
                <div className={styles.skeletonTypeList}>
                    <div className={styles.skeletonType}></div>
                    <div className={styles.skeletonType}></div>
                </div>
            </div>
        </div>
    );
};

export default PokemonSkeleton;
