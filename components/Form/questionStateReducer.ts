import { KeyboardActions, Actions } from "./types"
import { ActiveQuestionSchema } from "./types"

export type ActiveState = {
    questionState: ActiveQuestionSchema[],
    isSubmittable: boolean,
    selectedQuestionIndex: number
}

type AnswerGivenAction = { id: string, value: boolean, type: Actions }
type QuestionSelectedKeyboardAction = { selectionType: KeyboardActions, type: Actions }
type QuestionDeselectedKeyboardAction = { type: Actions }
type AllActions = AnswerGivenAction | QuestionSelectedKeyboardAction | QuestionDeselectedKeyboardAction

export type Reducer = (state: ActiveState, action: AllActions) => ActiveState

const answerGivenActionTypeguard =
    (action: AllActions): action is AnswerGivenAction => action.type === Actions.ANSWER_GIVEN

const questionSelectedKeyboardActionTypeguard =
    (action: AllActions): action is QuestionSelectedKeyboardAction => action.type === Actions.QUESTION_SELECTED_KEYBOARD

const questionDeselectedKeyboardActionTypeguard =
    (action: AllActions): action is QuestionDeselectedKeyboardAction => action.type === Actions.QUESTION_DESELECTED_KEYBOARD

const initialiser = ({questionState, isSubmittable, selectedQuestionIndex}: ActiveState): ActiveState => {
    // first question is always enabled
    const [firstQuestion, ...rest] = questionState

    return {
        questionState: [
            {
                ...firstQuestion,
                enabled: true,
            },
            ...rest
        ],
        selectedQuestionIndex,
        isSubmittable
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
                
                const previous: ActiveQuestionSchema = acc[index - 1]

                if (index > answeredQuestionIndex) {
                    return [
                        ...acc,
                        {
                            ...question,
                            enabled: previous.value && previous.enabled
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
        if (selectionType === KeyboardActions.NextQuestion) {
            nextSelectedQuestionIndex = Math.max(
                Math.min(selectedQuestionIndex + 1, enabledQuestions.length - 1),
                0
            )
        }

        if (selectionType === KeyboardActions.PreviousQuestion) {
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
