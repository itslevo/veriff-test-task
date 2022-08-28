import styled from "styled-components"
import palette from "styles/palette"

const FormStyled = styled.div`
    width: 60%;
    max-width: 35rem;
    margin: 0 auto;
`

const SubmitButtonContainer = styled.div`
    text-align: right;
    padding-top: 5rem;
`

const ErrorMessage = styled.div`
    padding: 0.75rem 1.2rem;
    border-radius: 0.4rem;
    text-align: left;
    font-size: 1rem;
    color: white;
    background: ${palette.error};
`

export {
    SubmitButtonContainer,
    ErrorMessage
}

export default FormStyled