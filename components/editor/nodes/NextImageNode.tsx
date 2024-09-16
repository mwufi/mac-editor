import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import NextImageView from '../NextImage'

export interface NextImageOptions {
  loader?: (src: string, width: number, quality?: number) => string
}

const NextImageNode = Node.create<NextImageOptions>({
  name: 'nextImage',
  group: 'block',
  content: 'inline*',

  addOptions() {
    return {
      loader: undefined,
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: 768,
      },
      height: {
        default: 400,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="next-image"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'next-image' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(NextImageView)
  },
})

export default NextImageNode;