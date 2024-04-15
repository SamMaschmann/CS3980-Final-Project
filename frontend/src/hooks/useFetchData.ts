import axios from "axios"
import { useEffect, useState } from "react"

export function useFetchData<T>(url: string){
    const [isLoading, setIsLoading] = useState(true)
    const [apiData, setApiData] = useState<T[]>()
    const [error, setError] = useState<unknown>()


    async function fetchData() {
        try {
        const res = await axios.get(url)

        const data = await res.data

        setApiData(data)
        setIsLoading(false)
        }
        catch (err) {
            setError(err)
            setIsLoading(false)
        }
    }

    useEffect(()=> {
        fetchData()
    }, [url])


    return {isLoading, apiData, error}


}