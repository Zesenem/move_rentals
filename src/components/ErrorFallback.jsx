import { FaExclamationTriangle } from "react-icons/fa";
import Button from "./Button";

function ErrorFallback({ resetError }) {
  const handleReload = () => {
    resetError();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-phantom px-4 text-center">
      <FaExclamationTriangle className="mb-6 text-6xl text-red-500" />
      <h1 className="mb-4 text-4xl font-extrabold text-cloud">Something Went Wrong</h1>
      <p className="mb-8 max-w-md text-space">
        An unexpected error occurred and our team has been notified. Please try reloading the page.
      </p>
      <Button onClick={handleReload} variant="primary">
        Back to Home
      </Button>
    </div>
  );
}

export default ErrorFallback;
