import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import * as Sentry from "@sentry/react";

import App from "./App.jsx";
import ErrorFallback from "./components/ErrorFallback.jsx";
import RouteErrorBoundary from "./components/RouteErrorBoundary.jsx";
import HomePage from "./pages/HomePage.jsx";

import "./index.css";

const AdminWorkspacePage = lazy(() => import("./pages/AdminWorkspacePage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const MotorcyclePage = lazy(() => import("./pages/MotorcyclePage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage.jsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.jsx"));

const routeFallback = (
  <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-graphite border-t-cloud" />
    <span className="sr-only">Loading page</span>
  </div>
);

const withSuspense = (page) => <Suspense fallback={routeFallback}>{page}</Suspense>;

Sentry.init({
  dsn: "https://63e09e83dc19c7365dd42385009bc409@o4509673502736384.ingest.de.sentry.io/4509673504505936",
  tunnel: "/.netlify/functions/sentry-proxy",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "motorcycle/:slug", element: withSuspense(<MotorcyclePage />) },
      { path: "terms-and-conditions", element: withSuspense(<TermsPage />) },
      { path: "privacy-policy", element: withSuspense(<PrivacyPolicyPage />) },
      { path: "contact", element: withSuspense(<ContactPage />) },
      {
        path: "admin",
        element: withSuspense(<AdminWorkspacePage />),
      },
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </HelmetProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
);
