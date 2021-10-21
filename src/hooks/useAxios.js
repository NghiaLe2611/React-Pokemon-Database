import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useAxios = ({ url, method, body = null, headers = null }) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

    const fetchData = useCallback(() => {
        axios[method ? method : 'get'](url, JSON.parse(headers), JSON.parse(body))
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                // setData(null);
                setError('Something went wrong. Please try again!');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url, method, body, headers]);

	useEffect(() => {
		fetchData();
	}, [method, url, body, headers, fetchData]);

	return { data, error, loading, fetchData };
};

export default useAxios;
