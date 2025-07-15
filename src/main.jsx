import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

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

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "motorcycle/:slug",
        element: <MotorcyclePage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "booking-success/:orderId",
        element: <BookingSuccessPage />,
      },
      {
        path: "terms-and-conditions",
        element: <TermsPage />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
