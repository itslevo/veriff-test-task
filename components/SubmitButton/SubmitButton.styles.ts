import styled from "styled-components"
import palette from "../../styles/palette"

type SubmitButtonStyledProps = {
    $active: boolean;
}

const SubmitButtonStyled = styled.button<SubmitButtonStyledProps>`
    padding: 0.85rem 1.2rem;
    border: none;
    border-radius: 0.3rem;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.05rem;
    background-color: ${props => props.$active ? palette.ctaActive : palette.ctaInactive};
    color: ${props => props.$active ? "white" : palette.ctaInactiveText};
    cursor: pointer;
    transition: all 0.1s;
`

export default SubmitButtonStyled
