import { useState, useEffect } from "react"

import { ActiveQuestionSchema } from "../Form/types"

import BooleanToggleStyled,
    { BooleanToggleButton, QuestionText } from "./BooleanToggle.styles"

type BooleanToggleProps = ActiveQuestionSchema & {
    onSelect: (value: any) => void
}

const BooleanToggle = ({
    id,
    description,
    value = null,
    onSelect,
    enabled,
    keyboardSelected = false
}: BooleanToggleProps) => {
    const [isToggledOn, setIsToggledOn] = useState<boolean | null>(value)
    const identifier = `button-${id}`

    useEffect(() => {
        setIsToggledOn(value)
    }, [ value ])

    return (
        <BooleanToggleStyled
            $disabled={!enabled}
            $keyboardSelected={keyboardSelected}
        >
            <QuestionText>{description}</QuestionText>
            <BooleanToggleButton
                id={`${identifier}-true`}
                type="button"
                value="Yes"
                onClick={() => {
                    setIsToggledOn(true)
                    onSelect(true)
                }}
                disabled={!enabled}
                $selected={isToggledOn === true}
            />
            <BooleanToggleButton
                id={`${identifier}-false`}
                type="button"
                value="No"
                onClick={() => {
                    setIsToggledOn(false)
                    onSelect(false)
                }}
                disabled={!enabled}
                $selected={isToggledOn === false}
            />
        </BooleanToggleStyled>
    )
}

export default BooleanToggle
