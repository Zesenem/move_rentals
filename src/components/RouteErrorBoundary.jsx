import { useEffect } from "react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { FaExclamationTriangle } from "react-icons/fa";
import Button from "./Button";

function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const isResponseError = isRouteErrorResponse(error);

  // Route-level errors bypass Sentry's ErrorBoundary, so report them manually.
  useEffect(() => {
    if (!isResponseError) {
      Sentry.captureException(error);
    }
  }, [error, isResponseError]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-phantom px-4 text-center">
      <FaExclamationTriangle className="mb-6 text-6xl text-red-500" />
      <h1 className="mb-4 text-4xl font-extrabold text-cloud">
        {isResponseError ? `Error ${error.status}` : "Something Went Wrong"}
      </h1>
      <p className="mb-8 max-w-md text-space">
        {isResponseError
          ? error.statusText || "The page could not be loaded."
          : "An unexpected error occurred and our team has been notified. Please try again."}
      </p>
      <Button onClick={() => navigate("/")} variant="primary">
        Back to Home
      </Button>
    </div>
  );
}

export default RouteErrorBoundary;
