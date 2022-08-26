import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"

import {QuestionSchema} from "../components/Form/types"

import Form from "../components/Form"

export default {
  title: "Form",
  component: Form,
} as ComponentMeta<typeof Form>

const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />

const defaultSchema: QuestionSchema[] = [
    {
        id: "aaa",
        priority: 10,
        description: "Face on the picture matches face on the document"
    },
    {
        id: "bbb",
        priority: 5,
        description: "Veriff supports presented document"
    },
    {
        id: "ccc",
        priority: 7,
        description: "Face is clearly visible"
    },
    {
        id: "ddd",
        priority: 3,
        description: "Document data is clearly visible"
    }
]


export const ReferenceExample = Template.bind({})

ReferenceExample.args = {
    data: defaultSchema
}
