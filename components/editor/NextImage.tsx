'use client'

import ImageFromNext from 'next/image'
import { NodeViewWrapper } from '@tiptap/react'
import ResizableContainer from './ResizableContainer'
import React from 'react';

interface FullWidthImageProps {
  src: string;
  alt: string;
  title?: string;
  width: number;
  height: number;
  loader?: (src: string, width: number, quality?: number) => string;
}

const FullWidthImage = ({ src, alt, title, width, height, loader }: FullWidthImageProps) => {
  return (
    <>
      <ImageFromNext
        src={src}
        alt={alt || ''}
        title={title}
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
        loader={loader}
      />
    </>
  )
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      )
    }

    // Return children components in case of no error

    return this.props.children
  }
}

interface NextImageViewProps {
  node: {
    attrs: {
      src: string;
      alt: string;
      title?: string;
      width: number;
      height: number;
    };
  };
  updateAttributes: (attrs: Partial<NextImageViewProps['node']['attrs']>) => void;
  editor: {
    isEditable: boolean;
    extensionStorage: {
      nextImage: {
        options: {
          loader?: (src: string, width: number, quality?: number) => string;
        };
      };
    };
  };
}

const NextImageView = ({ node, updateAttributes, editor }: NextImageViewProps) => {
  const { src, alt, title, width, height } = node.attrs
  const isEditing = editor.isEditable
  const loader = editor.extensionStorage?.nextImage?.options?.loader

  const handleResize = (newWidth: number, newHeight: number) => {
    updateAttributes({ width: newWidth, height: newHeight })
  }

  return (
    <NodeViewWrapper className="next-image-wrapper">
      <ErrorBoundary>

        <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw]">
          <ResizableContainer
            width={width}
            height={height}
            isEditing={isEditing}
            onResize={handleResize}
          >
            <FullWidthImage
              src={src}
              alt={alt}
              title={title}
              width={width}
              height={height}
              loader={loader}
            />
          </ResizableContainer>
          <div className="md:hidden">
            <ImageFromNext
              src={src}
              alt={alt || ''}
              title={title}
              layout="responsive"
              width={width}
              height={height}
              loader={loader}
            />
          </div>
        </div>
      </ErrorBoundary>
    </NodeViewWrapper>
  )
}

export default NextImageView
