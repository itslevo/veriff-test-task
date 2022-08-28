/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useReducer, } from "react"

import {
    KeyboardInputs,
    Actions,
    QuestionSchema,
    ActiveQuestionSchema
} from "../types"
import questionStateReducer,
    {
        initialiser,
        Reducer,
        ActiveState
    } from "../reducer/questionStateReducer"
import useEventListeners from "./useEventListeners"


type UseQuestionStateHook = (data: QuestionSchema[]) => {
    questionState: ActiveQuestionSchema[],
    isSubmittable: boolean,
    nextQuestion: (id: string) => (value: any) => void
}

const useQuestionState: UseQuestionStateHook = (data) => {
    const [
        {
            questionState,
            isSubmittable,
            selectedQuestionIndex
        },
        dispatch
    ] = useReducer<Reducer, ActiveState>(
        questionStateReducer,
        {
            questionState: data
                .sort((a, b) => a.priority - b.priority) // Pre-sorting on priority here
                .map<ActiveQuestionSchema>((question) => ({ // Mapping QuestionSchema into ActiveQuestionSchema
                    ...question,
                    enabled: false,
                    keyboardSelected: false,
                    value: null
                })),
            isSubmittable: false,
            selectedQuestionIndex: 0
        },
        initialiser
    )
    const {
        timestamp,
        currentInput,
        keyboardNavigationIsActive
    } = useEventListeners()

    useEffect(() => {
        switch(currentInput) {
            case KeyboardInputs.AnswerNo: {
                const { id } = questionState[selectedQuestionIndex]
                nextQuestion(id)(false)
                return
            }
            case KeyboardInputs.AnswerYes: {
                const { id } = questionState[selectedQuestionIndex]
                nextQuestion(id)(true)
                return
            }
            case KeyboardInputs.NextQuestion:
            case KeyboardInputs.PreviousQuestion: {
                dispatch({ type: Actions.QUESTION_SELECTED_KEYBOARD, selectionType: currentInput })
                return
            }
            default:
                return
        }
    }, [ timestamp ])

    useEffect(() => {
        if (keyboardNavigationIsActive === false) {
            dispatch({ type: Actions.QUESTION_DESELECTED_KEYBOARD })
        }
    }, [ keyboardNavigationIsActive ])

    const nextQuestion = (id: string) => (value: any) => {
        dispatch({ id, value, type: Actions.ANSWER_GIVEN })
    }

    return {
        questionState,
        isSubmittable,
        nextQuestion
    }
}

export default useQuestionState
