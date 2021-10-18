import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useAxios = ({ url, method, body = null, headers = null }) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setloading] = useState(true);

	const fetchData = useCallback(() => {
        axios[method ? method : 'get'](url, JSON.parse(headers), JSON.parse(body))
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                setError('Something went wrong. Please try again!');
            })
            .finally(() => {
                setloading(false);
            });
    }, [method, url, body, headers]);

	useEffect(() => {
		fetchData();
	}, [method, url, body, headers, fetchData]);

	return { data, error, loading };
};

export default useAxios;
