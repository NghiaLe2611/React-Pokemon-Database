import { Suspense } from 'react';
// import LoadingIndicator from './LoadingIndicator';

const Loadable = (Component) => (props) =>
	(
		<Suspense fallback={<></>}>
			<Component {...props} />
		</Suspense>
	);

export default Loadable;
