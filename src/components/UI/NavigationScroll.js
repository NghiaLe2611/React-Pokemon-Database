import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationScroll = ({ children }) => {
	const location = useLocation();
	const { pathname } = location;
	const scrollRef = useRef(null);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
	}, [pathname]);

	useEffect(() => {
		const handlePopState = () => {
			if (scrollRef.current) {
				scrollRef.current.scrollIntoView({ behavior: 'smooth' });
			}
		};
		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, []);

	return (
		<>
			<div ref={scrollRef} />
			{children || null}
		</>
	);
};

export default NavigationScroll;
