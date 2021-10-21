import { useState, useCallback } from 'react';
import axios from 'axios';

const useFetch = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = useCallback(async ({ url, method, body = null, headers = null }, applyData) => {
        setIsLoading(true);
		setError(null);

        await axios[method ? method : 'get'](url, JSON.parse(headers), JSON.parse(body))
            .then((res) => {
                applyData(res.data);
            })
            .catch((err) => {
                setError('Something went wrong. Please try again!');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

	return { error, isLoading, fetchData };
};

export default useFetch;
