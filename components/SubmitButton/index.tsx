import SubmitButtonStyled from "./SubmitButton.styles"

type SubmitButtonProps = {
    active: boolean;
    onSubmit: () => void
}

const SubmitButton = ({ active, onSubmit }: SubmitButtonProps) => {
    return (
        <SubmitButtonStyled
            $active={active}
            onClick={onSubmit}
            disabled={!active}
        >
            Submit
        </SubmitButtonStyled>
    )
}

export default SubmitButton