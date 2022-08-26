# Veriff Technical Task

Here are the main parts:

```
├───BooleanToggle
├───ErrorPage
├───Form
│   ├───hooks
│   │   ├─useEventListeners
│   │   └─useQuestionState
│   └─questionStateReducer
└───SubmitButton
```

In order to run, `npm install` and `npm run dev`.
In order to see an instance with the reference example ran in Storybooke, run `npm run build-storybook` and `npm run storybook`.

The Form component uses the `useQuestionState` hook, which in turn uses `useEventListeners` to track keyboard presses and clicks, and `questionStateReducer` as the single data source. In effect, the hook is a kind of controller, which then outputs the data for display components to pick up.

On the outside, there is a simple hook that uses the request method from `api.js`, and outputs the loading, error and success states.

Upon successful submission, we redirect via next's router to `/success`.
