const TailwindSizeMarker = () => {
    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div className="fixed bottom-2 left-2 p-2 bg-gray-200 text-gray-700 text-xs font-mono rounded-md opacity-75 z-50">
            <div className="sm:hidden">xs</div>
            <div className="hidden sm:block md:hidden">sm</div>
            <div className="hidden md:block lg:hidden">md</div>
            <div className="hidden lg:block xl:hidden">lg</div>
            <div className="hidden xl:block 2xl:hidden">xl</div>
            <div className="hidden 2xl:block">2xl</div>
        </div>
    );
};

export default TailwindSizeMarker;
