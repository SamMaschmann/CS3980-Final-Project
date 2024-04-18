import { useState, useEffect } from "react";
import axios from "axios";

export function useFetchData<T>(url: string){
    const [isLoading, setIsLoading] = useState(true);
    const [apiData, setApiData] = useState<T[] | undefined>();
    const [error, setError] = useState<unknown>();

    useEffect(()=> {
        async function fetchData() {
            try {
                const res = await axios.get(url);
                const data = await res.data;
                console.log("API Data:", data);
                setApiData(data);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        }
        fetchData();
    }, [url]);

    return { isLoading, apiData, error };
}
