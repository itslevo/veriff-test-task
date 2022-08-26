import styled from "styled-components"
import palette from "../../styles/palette"

type BooleanToggleStyledProps = {
    $disabled: boolean;
    $keyboardSelected: boolean;
}

const BooleanToggleStyled = styled.div<BooleanToggleStyledProps>`
    padding: 0.5rem 1rem;
    background: ${props => props.$keyboardSelected ? palette.buttonHover : "none"};
    color: ${props => props.$disabled ? palette.textInactive : palette.textActive};
    transition: all 0.1s;

    &:hover {
        background: ${props => props.$disabled ? "none" : palette.ctaInactive};
    }

    & input {
        cursor: ${props => props.$disabled ? "initial" : "pointer"};
    }

    & input:first-of-type {
        border-top-left-radius: 0.4rem;
        border-bottom-left-radius: 0.4rem;
        border-right: none;
    }

    & input:last-of-type {
        border-top-right-radius: 0.4rem;
        border-bottom-right-radius: 0.4rem;
    }
`

const BooleanToggleButton = styled.input<{ $selected: boolean }>`
    border: 2px solid ${palette.ctaActive};
    padding: 0.35rem 1.5rem;
    font-size: 1.2rem;
    background:  ${props => props.$selected ? palette.buttonActive : "white"};
    color:  ${props => props.$selected ? "white" : palette.buttonActive};
    transition: all 0.1s;

    &:disabled {
        border-color: ${palette.ctaInactive};
        color: ${props => props.$selected ? palette.ctaInactiveText : palette.textInactive};
        background: ${props => props.$selected ? palette.ctaInactive : "white"};

        &:hover {
            background: white;
        }
    }

    &:hover {
        background: ${props => props.$selected ? palette.buttonActive : palette.buttonHover};
    }
`

const QuestionText = styled.div`
    padding-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: 400;
`

export {
    BooleanToggleButton,
    QuestionText
}

export default BooleanToggleStyled
