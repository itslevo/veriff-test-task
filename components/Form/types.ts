
export enum Actions {
    ANSWER_GIVEN,
    QUESTION_SELECTED_KEYBOARD,
    QUESTION_DESELECTED_KEYBOARD
}

export enum KeyboardActions {
    NextQuestion = "ArrowDown",
    PreviousQuestion = "ArrowUp",
    AnswerYes = "1",
    AnswerNo = "2"
}

export type QuestionSchema = {
    id: string;
    priority: number;
    description: string;
}

export type ActiveQuestionSchema = Omit<QuestionSchema, "priority"> & {
    keyboardSelected: boolean;
    enabled: boolean;
    value?: any;
}
