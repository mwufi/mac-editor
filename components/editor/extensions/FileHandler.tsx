import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export interface FileHandlerOptions {
  allowedMimeTypes: string[]
  onDrop: (editor: any, files: File[], pos: number) => void
  onPaste: (editor: any, files: File[], htmlContent: string | null) => void
}

const FileHandler = Extension.create<FileHandlerOptions>({
  name: 'fileHandler',

  addOptions() {
    return {
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      onDrop: () => { },
      onPaste: () => { },
    }
  },

  addProseMirrorPlugins() {
    const { allowedMimeTypes, onDrop, onPaste } = this.options

    return [
      new Plugin({
        key: new PluginKey('fileHandler'),
        props: {
          handleDOMEvents: {
            drop: (view, event) => {
              const { state } = view
              const { tr } = state
              const posAtCoords = view.posAtCoords({ left: event.clientX, top: event.clientY })

              if (!posAtCoords) {
                return false
              }

              const pos = posAtCoords.pos

              const files = Array.from(event.dataTransfer?.files || []).filter(file =>
                allowedMimeTypes.includes(file.type)
              )

              if (files.length === 0) {
                return false
              }

              event.preventDefault()

              onDrop(this.editor, files, pos)

              return true
            },
            paste: (view, event) => {
              console.log("We just pasted!")
              const files = Array.from(event.clipboardData?.files || []).filter(file =>
                allowedMimeTypes.includes(file.type)
              )

              if (files.length === 0) {
                return false
              }

              event.preventDefault()

              const htmlContent = event.clipboardData?.getData('text/html') || null

              onPaste(this.editor, files, htmlContent)

              return true
            },
          },
        },
      }),
    ]
  },
})

export default FileHandler