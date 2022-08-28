import { Actions, KeyboardInputs } from "../types"
import questionStateReducer,
    {
        initialiser,
        ActionsUnion
    } from "./questionStateReducer"

describe("initialiser", () => {
    it("returns the state unchanged if no questions have been passed in", () => {
        const mockInitialState = {
            questionState: [],
            isSubmittable: false,
            selectedQuestionIndex: 0
        }

        expect(initialiser(mockInitialState)).toStrictEqual(mockInitialState)
    })

    it("returns the first question pre-enabled", () => {
        const mockInitialState = {
            questionState: [{
                id: "boo",
                description: "",
                keyboardSelected: false,
                enabled: false,
                value: false
            }],
            isSubmittable: false,
            selectedQuestionIndex: 0
        }

        const { questionState: [firstQuestion] } = initialiser(mockInitialState)

        expect(firstQuestion.enabled).toBe(true)
    })
})

describe("questionStateReducer", () => {
    const mockInitialState = {
        questionState: [
            {
                id: "foo",
                description: "",
                keyboardSelected: false,
                enabled: true,
                value: true
            },
            {
                id: "boo",
                description: "",
                keyboardSelected: false,
                enabled: true,
                value: null
            },
        ],
        isSubmittable: false,
        selectedQuestionIndex: 0
    }

    it("returns state if no known action was triggered", () => {
        const result = questionStateReducer(mockInitialState, { type: "UNKNOWN" } as unknown as ActionsUnion)
        expect(result).toStrictEqual(mockInitialState)
    })

    describe("answerGivenAction", () => {
        it("returns the state unchanged if the question id is incorrect", () => {
            const mockAction = { id: "wrong", value: true, type: Actions.ANSWER_GIVEN }
            expect(questionStateReducer(mockInitialState, mockAction)).toStrictEqual(mockInitialState)
        })

        it("sets isSubmittable to true if the right conditions are met", () => {

            const mockAction = { id: "boo", value: true, type: Actions.ANSWER_GIVEN }
            expect(questionStateReducer(mockInitialState, mockAction)).toHaveProperty("isSubmittable", true)
        })

        it("enables the next question if the previous one is answered", () => {
            const newMockInitialState = {
                ...mockInitialState,
                questionState: [
                    {
                        id: "foo",
                        description: "",
                        keyboardSelected: false,
                        enabled: true,
                        value: null
                    },
                    {
                        id: "boo",
                        description: "",
                        keyboardSelected: false,
                        enabled: false,
                        value: null
                    },
                ]
            }

            const mockAction = { id: "foo", value: true, type: Actions.ANSWER_GIVEN }
            const { questionState } = questionStateReducer(newMockInitialState, mockAction)
            const [, lastQuestion] = questionState

            expect(lastQuestion).toHaveProperty("enabled", true)
        })
    })

    describe("questionSelectedKeyboardAction", () => {
        it("increments the selected index and sets the question at index to keyboardEnabled: true", () => {
            const mockAction = {
                selectionType: KeyboardInputs.NextQuestion,
                type: Actions.QUESTION_SELECTED_KEYBOARD
            }
            
            const { questionState, selectedQuestionIndex } = questionStateReducer(mockInitialState, mockAction)

            expect(selectedQuestionIndex).toBe(1)
            expect(questionState[selectedQuestionIndex]).toHaveProperty("keyboardSelected", true)
        })

        it("decrements the selected index if the back keyboard action is taken", () => {
            const mockAction = {
                selectionType: KeyboardInputs.PreviousQuestion,
                type: Actions.QUESTION_SELECTED_KEYBOARD
            }
            
            const { questionState, selectedQuestionIndex } = questionStateReducer(mockInitialState, mockAction)
            const [ firstQuestion ] = questionState

            expect(selectedQuestionIndex).toBe(0)
            expect(firstQuestion).toHaveProperty("keyboardSelected", true)
        })
    })

    describe("questionDeselectedKeyboardAction", () => {
        it("sets every question's keyboardEnabled to false", () => {
            const newMockInitialState = {
                ...mockInitialState,
                questionState: [
                    {
                        id: "foo",
                        description: "",
                        keyboardSelected: true,
                        enabled: true,
                        value: true
                    },
                    {
                        id: "boo",
                        description: "",
                        keyboardSelected: true,
                        enabled: true,
                        value: true
                    },
                ]
            }

            const mockAction = {
                type: Actions.QUESTION_DESELECTED_KEYBOARD
            }
            
            const { questionState } = questionStateReducer(newMockInitialState, mockAction)
            const keyboardSelectedQuestionsBefore = newMockInitialState.questionState.filter(({ keyboardSelected }) => keyboardSelected)
            const keyboardSelectedQuestionsAfter = questionState.filter(({ keyboardSelected }) => keyboardSelected)

            expect(keyboardSelectedQuestionsBefore).toHaveLength(2)
            expect(keyboardSelectedQuestionsAfter).toHaveLength(0)
        })
    })
})