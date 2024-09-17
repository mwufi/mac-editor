import { Extension } from '@tiptap/core'

async function evaluateExpression(expression: string) {
  // must be a more complex expression, so we call AI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that can evaluate mathematical expressions.',
        },
        {
          role: 'user',
          content: `Evaluate the expression: ${expression}`,
        },
      ],
    }),
  })

  const data = await response.json()
  const result = data.choices[0].message.content
  return result;
}

const CalculatorExtension = Extension.create({
  name: 'calculator',

  addKeyboardShortcuts() {
    return {
      '=': () => {
        const { state, dispatch } = this.editor.view
        const { from, to } = state.selection

        // Get the text before the cursor
        const textBefore = state.doc.textBetween(Math.max(0, from - 100), from, '\n')

        // Find the last expression (numbers and operators)
        const match = textBefore.match(/(\d+[\+\-\*\/]\d+)$/)

        if (match) {
          const expression = match[1]
          try {
            // Evaluate the expression
            const result = eval(expression)

            // Insert the result
            dispatch(state.tr.insertText(`=${result}`, from, to))

            return true
          } catch (error) {
            console.error('Invalid expression:', error)
          }
        } else {
          // should call AI
        }
        return false
      },
    }
  },
})

export default CalculatorExtension