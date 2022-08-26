import ErrorPageStyled from "./ErrorPage.styles"

type ErrorPageProps = {
    message: string
}

const ErrorPage = ({ message }: ErrorPageProps) =>
    <ErrorPageStyled>{ message }</ErrorPageStyled>


export default ErrorPage