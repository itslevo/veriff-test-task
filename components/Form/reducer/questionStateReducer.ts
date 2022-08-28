import { KeyboardInputs, Actions } from "../types"
import { ActiveQuestionSchema } from "../types"

export type ActiveState = {
    questionState: ActiveQuestionSchema[],
    isSubmittable: boolean,
    selectedQuestionIndex: number
}

type AnswerGivenAction = { id: string, value: boolean, type: Actions }
type QuestionSelectedKeyboardAction = { selectionType: KeyboardInputs, type: Actions }
type QuestionDeselectedKeyboardAction = { type: Actions }
export type ActionsUnion = AnswerGivenAction | QuestionSelectedKeyboardAction | QuestionDeselectedKeyboardAction

export type Reducer = (state: ActiveState, action: ActionsUnion) => ActiveState

const answerGivenActionTypeguard =
    (action: ActionsUnion): action is AnswerGivenAction => action.type === Actions.ANSWER_GIVEN

const questionSelectedKeyboardActionTypeguard =
    (action: ActionsUnion): action is QuestionSelectedKeyboardAction => action.type === Actions.QUESTION_SELECTED_KEYBOARD

const questionDeselectedKeyboardActionTypeguard =
    (action: ActionsUnion): action is QuestionDeselectedKeyboardAction => action.type === Actions.QUESTION_DESELECTED_KEYBOARD

const initialiser = (state: ActiveState): ActiveState => {
    const { questionState } = state
    // first question is always enabled
    const [firstQuestion, ...rest] = questionState

    if (questionState.length === 0) {
        return state
    }

    return {
        ...state,
        questionState: [
            {
                ...firstQuestion,
                enabled: true,
            },
            ...rest
        ],
    }
}

const questionStateReducer: Reducer = (state, action) => {
    const { questionState, selectedQuestionIndex } = state

    if (answerGivenActionTypeguard(action)) {
        // The action to give an answer to a question is triggered,
        // so we need to check whether the next questions need to be enabled/disabled, and
        // whether the submit button needs to be made active.
        const { id, value } = action

        const answeredQuestionIndex = questionState.findIndex((question) => id === question.id)

        if (answeredQuestionIndex === -1) {
            return state
        }

        const newQuestionState = questionState
            .reduce<ActiveQuestionSchema[]>((acc, question, index) => {
                if (index === answeredQuestionIndex) {
                    return [
                        ...acc,
                        {
                            ...question,
                            value
                        }
                    ]
                }

                if (index > answeredQuestionIndex) {
                    const previous: ActiveQuestionSchema = acc[index - 1]

                    return [
                        ...acc,
                        {
                            ...question,
                            enabled: Boolean(previous.value && previous.enabled)
                        }
                    ]
                }

                return [...acc, question]
            }, [])

        return {
            ...state,
            questionState: newQuestionState,
            isSubmittable:
                newQuestionState.every(({ enabled, value }) => enabled && value === true) ||
                newQuestionState.some(({ enabled, value }) => enabled && value === false)
        }
    } 

    if (questionSelectedKeyboardActionTypeguard(action)) {
        // If a keyboard action to select a question is made,
        // we bound the selection by 0 and the size of the question set.
        // Then, we advance the index and set the relevant question object to { keyboardSelected: true }
        const { selectionType } = action
        const enabledQuestions = questionState.filter((question) => question.enabled)

        let nextSelectedQuestionIndex = selectedQuestionIndex
        if (selectionType === KeyboardInputs.NextQuestion) {
            // If we're advancing, ensure the index does not exceed the maximum possible in the questions array,
            // but is larger than 0
            nextSelectedQuestionIndex = Math.max(
                Math.min(selectedQuestionIndex + 1, enabledQuestions.length - 1),
                0
            )
        }

        if (selectionType === KeyboardInputs.PreviousQuestion) {
            // If we're going back, ensure the index is not smaller than 0
            nextSelectedQuestionIndex = Math.max(selectedQuestionIndex - 1, 0)
        }

        const newQuestionState = questionState.map((question, index) => ({
            ...question,
            keyboardSelected: index === nextSelectedQuestionIndex
        }))

        return {
            ...state,
            questionState: newQuestionState,
            selectedQuestionIndex: nextSelectedQuestionIndex
        }
    }

    if (questionDeselectedKeyboardActionTypeguard(action)) {
        const newQuestionState = questionState.map<ActiveQuestionSchema>((question) => {
            return {
                ...question,
                keyboardSelected: false
            }
        })

        return {
            ...state,
            questionState: newQuestionState
        }
    }

    return state
}

export {
    initialiser
}

export default questionStateReducer
