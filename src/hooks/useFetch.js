import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { useEffectOnce } from './useEffectOnce';

const useFetch = () => {
    const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const controller = useRef(null);

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
		}
	}, []);

	// Clean up axios request
    useEffectOnce(() => {
        const cancel = controller.current?.signal;
        return () => {
            if (cancel) {
                cancel.abort();
            }
        }
	}, []);

	return { data, error, isLoading, fetchData, setIsLoading };
};

export default useFetch;
