import { useEffect } from 'react';
import { Link, NavigationType, useLocation, useNavigationType } from 'react-router-dom';

const useBackButton = () => {
	const navType = useNavigationType();
	return navType === NavigationType.Pop;
};

export const useScrollToTop = () => {
	const { pathname } = useLocation();

	const isPop = useBackButton();

	const scrollToTop = () =>
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});

	useEffect(() => {
		console.log('scroll to top');
		scrollToTop();
	}, [pathname, isPop]);

	useEffect(() => {
		window.addEventListener('beforeunload', scrollToTop);
		return () => {
			window.removeEventListener('beforeunload', scrollToTop);
		};
	}, []);
};

export default function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}
