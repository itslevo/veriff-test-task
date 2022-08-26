/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback} from "react"
import { KeyboardActions } from "../types"

type EventListenerHookProps = (
    ) => {
        timestamp: number,
        currentAction: KeyboardActions | null,
        keyboardNavigationIsActive: boolean
    }

// This basically virtualises keyboard inputs, and them signals them to the main hook
// The timestamp works to de-duplicate similar entries
const useEventListeners: EventListenerHookProps = () => {
    const [currentAction, setCurrentAction] = useState<KeyboardActions | null>(null)
    const [timestamp, setTimestamp] = useState<number>(Date.now())
    const [keyboardNavigationIsActive, setkeyboardNavigationIsActive] = useState<boolean>(false)

    const keyEventListenerCallback = useCallback<(event: KeyboardEvent) => void>(({ key }) => {
        setkeyboardNavigationIsActive(true)

        if (Object.values(KeyboardActions).includes(key as KeyboardActions)) {
            setCurrentAction(key as KeyboardActions)
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
        currentAction,
        keyboardNavigationIsActive
    }
}

export default useEventListeners
