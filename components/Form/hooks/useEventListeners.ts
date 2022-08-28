/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback} from "react"
import { KeyboardInputs } from "../types"

type EventListenerHookProps = (
    ) => {
        timestamp: number,
        currentInput: KeyboardInputs | null,
        keyboardNavigationIsActive: boolean
    }

// This basically virtualises keyboard inputs, and them signals them to the main hook
// The timestamp works to de-duplicate similar entries
const useEventListeners: EventListenerHookProps = () => {
    const [currentInput, setCurrentInput] = useState<KeyboardInputs | null>(null)
    const [timestamp, setTimestamp] = useState<number>(Date.now())
    const [keyboardNavigationIsActive, setkeyboardNavigationIsActive] = useState<boolean>(false)

    const keyEventListenerCallback = useCallback<(event: KeyboardEvent) => void>(({ key }) => {
        setkeyboardNavigationIsActive(true)

        if (Object.values(KeyboardInputs).includes(key as KeyboardInputs)) {
            setCurrentInput(key as KeyboardInputs)
            setTimestamp(Date.now())
        }
    }, [])

    const clickEventListenerCallback = useCallback(() => {
        setkeyboardNavigationIsActive(false)
    }, [])

    useEffect(() => {
        window.addEventListener("keyup", keyEventListenerCallback)
        window.addEventListener("click", clickEventListenerCallback)

        return () => {
            window.removeEventListener("keyup", keyEventListenerCallback)
            window.removeEventListener("click", clickEventListenerCallback)
        }
    }, [])

    return {
        timestamp,
        currentInput,
        keyboardNavigationIsActive
    }
}

export default useEventListeners
