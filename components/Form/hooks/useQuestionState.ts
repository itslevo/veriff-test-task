/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useReducer, } from "react"

import {
    KeyboardActions,
    Actions,
    QuestionSchema,
    ActiveQuestionSchema
} from "../types"
import questionStateReducer,
    {
        initialiser,
        Reducer,
        ActiveState
    } from "../questionStateReducer"
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
                    keyboardSelected: false
                })),
            isSubmittable: false,
            selectedQuestionIndex: 0
        },
        initialiser
    )
    const {
        timestamp,
        currentAction,
        keyboardNavigationIsActive
    } = useEventListeners()

    useEffect(() => {
        switch(currentAction) {
            case KeyboardActions.AnswerNo: {
                const { id } = questionState[selectedQuestionIndex]
                nextQuestion(id)(false)
                return
            }
            case KeyboardActions.AnswerYes: {
                const { id } = questionState[selectedQuestionIndex]
                nextQuestion(id)(true)
                return
            }
            case KeyboardActions.NextQuestion:
            case KeyboardActions.PreviousQuestion: {
                dispatch({ type: Actions.QUESTION_SELECTED_KEYBOARD, selectionType: currentAction })
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

    useEffect(() => {

    }, [ questionState ])

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
