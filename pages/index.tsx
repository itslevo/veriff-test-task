import Form from "components/Form"
import ErrorPage from "components/ErrorPage"
import useApiRequest from "../api/useApiRequest"

const FormPage = () => {
    const {
        isLoading,
        data,
        error
    } = useApiRequest()

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <ErrorPage message={error} />}
            <div>
                {!error && !isLoading && <Form data={data} />}
            </div>
        </>
    )
}

export default FormPage