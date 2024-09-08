
// A full screen section. By default, the children are full height! this is great.
export const FullScreenSection = ({ children, className, peekNext = false }: { children?: React.ReactNode, className?: string, peekNext?: boolean }) => {
    return (
        <div className={`relative w-full ${peekNext ? "h-[95vh]" : "h-screen"} rounded-lg overflow-hidden ${className} grid w-full h-full`}>
            <div className="grid w-full h-full">
                {children}
            </div>
        </div>
    )
}

export const TwoColumnLayout = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${className}`}>
            {children}
        </div>
    )
}