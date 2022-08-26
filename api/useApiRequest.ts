import { useState, useEffect } from "react"
import { fetchChecks } from "./api"
import { QuestionSchema } from "../components/Form/types"

const useApiRequest = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState<QuestionSchema[]>([]) // need global data type
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        setIsLoading(true)

        fetchChecks()
            .then((data) => {
                if (!data) {
                    throw new Error("No data was returned.")
                }

                setData(data)
            })
            .catch((error) => { setError(`Request has failed: ${JSON.stringify(error)}`) })
            .finally(() => { setIsLoading(false) })

    }, [])

    return {
        isLoading,
        data,
        error
    }
}

export default useApiRequest