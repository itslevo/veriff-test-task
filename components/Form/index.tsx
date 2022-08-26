import { useCallback, useState } from "react"
import { useRouter } from "next/router"

import { submitCheckResults } from "../../api/api"
import BooleanToggle from "../BooleanToggle"
import SubmitButton from "../SubmitButton"
import useQuestionState from "./hooks/useQuestionState"
import FormStyled, { SubmitButtonContainer, ErrorMessage } from "./Form.styles"
import { QuestionSchema } from "./types"

type FormProps = {
    data: QuestionSchema[]
}

const Form = ({ data }: FormProps) => {
    const router = useRouter()
    const {
        questionState,
        isSubmittable,
        nextQuestion,
    } = useQuestionState(data)
    const [error, setError] = useState("")

    const submitCallback = useCallback(async () => {
        const questionResults = questionState
            .filter(({ enabled }) => enabled)
            .map(({ id, value  }) => ({ checkId: id, result: value }))

        submitCheckResults(questionResults).then(() => {
            console.log(questionResults)
            router.push("/success")
        }).catch((error) => {
            setError(JSON.stringify(error))
        })
    }, [questionState, router])

    return (
        <FormStyled>
            {questionState.map(
                (question, index) =>
                    <BooleanToggle
                        key={`${question.id} ${index}`}
                        {...question}
                        onSelect={nextQuestion(question.id)}
                    />
            )}
            <SubmitButtonContainer>
                {error && <ErrorMessage>Error: {error}</ErrorMessage>}
                <SubmitButton
                    active={isSubmittable}
                    onSubmit={() => { submitCallback() }}
                />
            </SubmitButtonContainer>
        </FormStyled>
    )
}

export default Form
