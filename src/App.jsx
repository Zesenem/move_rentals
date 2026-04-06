import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.cookieconsent) {
      window.cookieconsent.initialise({
        palette: {
          popup: {
            background: "#1E1E24",
            text: "#EDEFF7",
          },
          button: {
            background: "#6EE7B7",
            text: "#1E1E24",
          },
        },
        theme: "edgeless",
        content: {
          message:
            "This website uses cookies to ensure you get the best experience on our website.",
          dismiss: "Got it!",
          link: "Learn more",
          href: "/privacy-policy",
        },
      });
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash || "";
    const hasIdentityInviteToken = hash.includes("invite_token=");

    if (!hasIdentityInviteToken || location.pathname === "/admin") {
      return;
    }

    navigate(
      {
        pathname: "/admin",
        hash,
      },
      { replace: true }
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
      </div>
    </>
  );
}

export default App;
