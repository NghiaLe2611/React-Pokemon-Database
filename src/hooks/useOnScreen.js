import { useState, useEffect } from 'react';

const useOnScreen = (ref, rootMargin = '0px') => {
	// State and setter for storing whether element is visible
	const [isIntersecting, setIntersecting] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				// Update our state when observer callback fires
				setIntersecting(entry.isIntersecting);
			},
			{
				rootMargin,
			}
		);
		const current = ref.current;
		if (current) {
			observer.observe(current);
		}
		return () => {
			observer.unobserve(current);
		};
	}, [ref, rootMargin]);

	return isIntersecting;
};

// import { useState, useEffect } from 'react';

// const useOnScreen = ref => {
// 	const [isOnScreen, setOnScreen] = useState(false);

// 	const observer = new IntersectionObserver(
// 		([entry]) => setOnScreen(entry.isIntersecting),
// 		{
// 			threshold: [0.25, 0.5, 0.75],
// 		}
// 	);

// 	useEffect(() => {
// 		observer.observe(ref.current);
// 		return () => {
// 			observer.disconnect();
// 		};
// 	});

// 	return isOnScreen;
// };

export default useOnScreen;
