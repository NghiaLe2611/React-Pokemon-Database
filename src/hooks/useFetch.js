import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { useEffectOnce } from './useEffectOnce';

const useFetch = () => {
    const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
    // const [abortController, setAbortController] = useState(null);

	const controller = useRef(null);

	function getAbortController(controller) {
		if (controller.current == null) {
			controller.current = new AbortController();
		}
		return controller.current;
	}

	// const abortController = new AbortController();

	const fetchData = useCallback(async ({ url, method, body = null, headers = {} }, applyData) => {
		setIsLoading(true);
		setError(null);

		try {
            if (!controller.current) {
                controller.current = new AbortController();
            }

            // const signal = abortController?.signal;
			const response = await axios({
				method: method ? method : 'GET',
				url: url,
				headers: headers ? headers : {},
				data: body ? JSON.stringify(body) : null,
				signal: controller.current.signal,
			});
            
			if (applyData) {
                applyData(response.data);
            } else {
                setData(response.data);
            }

            setIsLoading(false);
            setError(null);
		} catch (err) {
            if (!axios.isCancel(err)) {
                setError('Something went wrong. Please try again!');
				setIsLoading(false);
            }
			// if (axios.isCancel(err)) {
			// 	console.log('Request canceled by cleanup:', err.message);
			// } else {
			// 	setError('Something went wrong. Please try again!');
			// 	setIsLoading(false);
			// }
		}

		// await axios[method ? method : 'get'](url, JSON.parse(headers), JSON.parse(body))
		//     .then((res) => {
		//         applyData(res.data);
		//     })
		//     .catch((err) => {
		//         setError('Something went wrong. Please try again!');
		//     })
		//     .finally(() => {
		//         setIsLoading(false);
		//     });
	}, []);

	// Clean up axios request
    useEffectOnce(() => {
        const cancel = controller.current?.signal;
        return () => {
            if (cancel) {
                cancel.abort();
            }
        }

		// const controller = new AbortController();
		// setAbortController(controller);

		// return () => {
		// 	controller.abort();
		// 	setAbortController(null);
		// };
	}, []);

	// useEffect(() => {
	// 	const cancel = getAbortController(controller);
	// 	return () => {
	// 		if (cancel) {
	// 			console.log('clean up', cancel);
	// 			setIsLoading(false);
	// 			cancel.abort();
	// 		}
	// 	};
	// }, []);

	return { data, error, isLoading, fetchData };
};

export default useFetch;
