interface ErrorMessageProps {
  message: string;
  className?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, className = '', onRetry }: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl ${className}`}>
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Error: </span>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline focus:outline-none"
        >
          Try again
        </button>
      )}
    </div>
  );
}