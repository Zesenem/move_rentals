import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

function NotFoundPage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="w-full max-w-md rounded-lg bg-arsenic p-8 shadow-lg">
        <FaExclamationTriangle className="mx-auto mb-6 animate-pulse text-6xl text-red-500" />
        <h1 className="mb-4 text-4xl font-extrabold text-cloud">404 - Page Not Found</h1>
        <p className="mb-8 text-steel">Sorry, the page you are looking for does not exist.</p>

        <Link
          to="/"
          className="inline-block rounded-md bg-cloud px-6 py-3 font-bold text-phantom transition-colors hover:bg-cloud/90"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
