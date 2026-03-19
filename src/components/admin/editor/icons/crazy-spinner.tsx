const CrazySpinner = () => {
    return (
        <div className="flex items-center justify-center gap-0.5" role="status" aria-live="polite">
            <div 
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.3s]" 
                aria-hidden="true"
            />
            <div 
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" 
                aria-hidden="true"
            />
            <div 
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500" 
                aria-hidden="true"
            />
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default CrazySpinner;
