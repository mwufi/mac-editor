'use client'

import { useState, useRef, useEffect } from "react"
interface ResizableContainerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  minWidth?: number;
  maxWidth?: number;
  isEditing: boolean;
  onResize: (width: number, height: number) => void;
}

const ResizableContainer = ({ children, width, height, minWidth = 200, maxWidth = 1400, isEditing, onResize }: ResizableContainerProps) => {
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef(null)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing) return
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  const handleMouseMove = (e) => {
    if (!isResizing) return
    const newWidth = Math.min(Math.max(e.clientX - containerRef.current?.getBoundingClientRect().left, minWidth), maxWidth)
    const newHeight = (height * newWidth) / width
    onResize(newWidth, newHeight)
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isResizing])

  return (
    <div
      ref={containerRef}
      className="relative border-3 border-transparent hover:border-gray-300 rounded-xl mx-auto my-8 hidden md:block"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {children}
      {isEditing && (
        <>
          <div
            className="absolute right-[-5px] bottom-[-5px] w-[10px] h-[10px] cursor-se-resize opacity-0 rounded-full transition-all duration-200 bg-gradient-to-br from-indigo-500 to-blue-500 shadow-md hover:opacity-100 hover:scale-110"
            onMouseDown={handleMouseDown}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'scale(1.2)'
            }}
            onMouseLeave={(e) => !isResizing && (e.currentTarget.style.opacity = '0')}
          />
          {isResizing && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
              {Math.round(width)}x{Math.round(height)}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ResizableContainer;
