'use client'

import React, { useState, useRef, useEffect } from 'react';
import ImageFromNext from 'next/image';
import { NodeViewWrapper } from '@tiptap/react';
import { loader } from './LocalFileLoader';

interface ResizableContainerProps {
  children: React.ReactNode;
  height: number;
  minHeight?: number;
  maxHeight?: number;
  isEditing: boolean;
  aspectRatio: number;
  onResize: (height: number) => void;
}

const ResizableContainer: React.FC<ResizableContainerProps> = ({
  children,
  height,
  minHeight = 100,
  maxHeight = 800,
  isEditing,
  aspectRatio,
  onResize
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing) return;
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newHeight = Math.min(Math.max(e.clientY - containerRect.top, minHeight), maxHeight);
    onResize(newHeight);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isResizing]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto my-8 group"
      style={{ height: `${height}px`, width: `${height * aspectRatio}px` }}
    >
      <div className="absolute inset-0 transition-all duration-200 group-hover:outline group-hover:outline-2 group-hover:outline-blue-500 rounded-lg">
        {children}
      </div>
      {isEditing && (
        <div
          className="absolute right-1 bottom-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          onMouseDown={handleMouseDown}
        />
      )}
      {isResizing && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
          {Math.round(height * aspectRatio)}x{Math.round(height)}
        </div>
      )}
    </div>
  );
};

interface FullWidthImageProps {
  src: string;
  alt: string;
  title?: string;
  height: number;
  aspectRatio: number;
}

const FullWidthImage: React.FC<FullWidthImageProps> = ({ src, alt, title, height, aspectRatio }) => {
  return (
    <ImageFromNext
      src={src}
      alt={alt || ''}
      title={title}
      layout="fill"
      objectFit="cover"
      className="rounded-lg"
      loader={loader}
    />
  );
};

interface NextImageViewProps {
  node: {
    attrs: {
      src: string;
      alt: string;
      title?: string;
      height: number;
      caption: string;
    };
  };
  updateAttributes: (attrs: Partial<NextImageViewProps['node']['attrs']>) => void;
  editor: {
    isEditable: boolean;
  };
}

const NextImageView: React.FC<NextImageViewProps> = ({ node, updateAttributes, editor }) => {
  const { src, alt, title, height, caption } = node.attrs;
  const [aspectRatio, setAspectRatio] = useState(16 / 9); // Default aspect ratio
  const isEditing = editor.isEditable;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
    img.src = src;
  }, [src]);

  const handleResize = (newHeight: number) => {
    updateAttributes({ height: newHeight });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateAttributes({ caption: e.target.value });
  };

  return (
    <NodeViewWrapper className="next-image-wrapper">
      <figure className="w-full">
        <div className="relative w-full">
          <ResizableContainer
            height={height}
            isEditing={isEditing}
            onResize={handleResize}
            aspectRatio={aspectRatio}
          >
            <FullWidthImage
              src={src}
              alt={alt}
              title={title}
              height={height}
              aspectRatio={aspectRatio}
            />
          </ResizableContainer>
        </div>
        <figcaption className="mt-2 text-center">
          {isEditing ? (
            <textarea
              value={caption}
              onChange={handleCaptionChange}
              className="w-full p-2 text-sm border rounded"
              placeholder="Enter image caption..."
            />
          ) : (
            <p className="text-sm text-gray-600">{caption}</p>
          )}
        </figcaption>
      </figure>
    </NodeViewWrapper>
  );
};

export default NextImageView;