import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import * as Sentry from "@sentry/react";

import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import MotorcyclePage from "./pages/MotorcyclePage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import BookingSuccessPage from "./pages/BookingSuccessPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

import "./index.css";

// --- Sentry Initialization ---
Sentry.init({
  dsn: "https://63e09e83dc19c7365dd42385009bc409@o4509673502736384.ingest.de.sentry.io/4509673504505936",
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: useEffect,
      useLocation: useLocation,
      useNavigationType: useNavigationType,
      createRoutesFromChildren: createRoutesFromChildren,
      matchRoutes: matchRoutes,
    }),
    Sentry.replayIntegration(),
  ],
  tunnel: "/.netlify/functions/sentry-proxy",
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// --- TanStack Query Client ---
const queryClient = new QueryClient();

// --- React Router ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "motorcycle/:slug", element: <MotorcyclePage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "booking-success/:orderId", element: <BookingSuccessPage /> },
      { path: "terms-and-conditions", element: <TermsPage /> },
      { path: "privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

// --- App Rendering ---
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
