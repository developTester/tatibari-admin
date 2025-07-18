export default function LoadingSpinner({ size = 'large' }) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-16 w-16',
    large: 'h-32 w-32'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
    </div>
  );
}