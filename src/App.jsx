import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CookieConsent from "./components/CookieConsent.jsx";
import { initialiseAnalyticsConsent } from "./services/analytics.js";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => initialiseAnalyticsConsent(), []);

  useEffect(() => {
    const hash = window.location.hash || "";
    const hasIdentityAuthToken =
      /(invite_token|recovery_token|confirmation_token|email_change_token)=/.test(hash);

    if (!hasIdentityAuthToken || location.pathname === "/admin") {
      return;
    }

    navigate(
      {
        pathname: "/admin",
        hash,
      },
      { replace: true },
    );
  }, [location.pathname, navigate]);

  return (
    <>
      <ScrollRestoration />
      <div className="flex min-h-screen flex-col bg-phantom font-sans">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </>
  );
}

export default App;
