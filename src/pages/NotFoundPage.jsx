import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
      <div className="bg-arsenic p-8 rounded-lg shadow-lg max-w-md w-full">
        <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-cloud mb-4">404 - Page Not Found</h1>
        <p className="text-steel mb-8">Sorry, the page you are looking for does not exist.</p>
        <Link
          to="/"
          className="bg-cloud text-phantom font-bold py-3 px-6 rounded-md hover:bg-cloud/90 transition-colors"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
