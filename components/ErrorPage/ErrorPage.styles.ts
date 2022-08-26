import styled from "styled-components"
import palette from "styles/palette"

const ErrorPageStyled = styled.div`
    width: 60%;
    max-width: 35rem;
    margin: 0 auto;
    text-align: center;
    color: white;
    background: ${palette.error};
    padding: 1rem;
`

export default ErrorPageStyled