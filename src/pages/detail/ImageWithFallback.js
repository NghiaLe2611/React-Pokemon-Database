import { useState, useEffect, memo } from "react";

const ImageWithFallback = ({ primarySrc, fallbackSrc, alt }) => {
    const [imageSrc, setImageSrc] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Only set image source if primarySrc exists
        if (primarySrc) {
            setImageSrc(primarySrc);
            setIsLoaded(false);
        }
    }, [primarySrc]);

    console.log(111, {
        primarySrc, fallbackSrc
    });

    const handleLoad = () => {
        // console.log("✅ Image loaded successfully");
        setIsLoaded(true);
    };

    const handleError = () => {
        // console.log("❌ Image failed to load, using fallback");
        if (imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
        }
    };

    if (!primarySrc && !fallbackSrc) {
        return null;
    }

    return (
        <img
            src={imageSrc || primarySrc}
            alt={alt || ""}
            onLoad={handleLoad}
            onError={handleError}
        />
    );
};

export default memo(ImageWithFallback);