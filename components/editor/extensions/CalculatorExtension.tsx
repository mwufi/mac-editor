import { Extension } from '@tiptap/core'

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
        }

        return false
      },
    }
  },
})

export default CalculatorExtension