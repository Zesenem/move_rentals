import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { FaExclamationTriangle, FaLock } from "react-icons/fa";

import Button from "../components/Button";
import AdminPage from "./AdminPage.jsx";
import {
  fetchAdminSession,
  getAdminToken,
  initAdminIdentity,
  logoutAdmin,
  onAdminIdentityEvent,
  openAdminLogin,
} from "../services/adminAuth.js";

const LoginCard = ({ errorMessage, onLogin }) => (
  <div className="container mx-auto px-4 py-16">
    <div className="mx-auto max-w-xl rounded-3xl border border-graphite/50 bg-arsenic p-8 shadow-xl">
      <div className="flex items-center gap-3 text-cloud">
        <div className="rounded-2xl bg-phantom p-3">
          <FaLock className="text-lg" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-graphite">
            Protected Area
          </p>
          <h1 className="mt-1 text-3xl font-extrabold">Admin Login</h1>
        </div>
      </div>

      <p className="mt-6 text-space">
        Sign in with the invited admin account to edit fleet metadata. This route is not public.
      </p>

      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      <div className="mt-8">
        <Button onClick={onLogin} className="w-full justify-center py-3">
          Open Login
        </Button>
      </div>

      <p className="mt-4 text-sm text-space">
        In local development, the Netlify widget may ask for your production site URL the first
        time it opens. That is expected.
      </p>
    </div>
  </div>
);

function AdminWorkspacePage() {
  const queryClient = useQueryClient();
  const [isIdentityReady, setIsIdentityReady] = useState(false);
  const [identityError, setIdentityError] = useState("");

  useEffect(() => {
    const handleInit = () => {
      setIsIdentityReady(true);
      queryClient.invalidateQueries({ queryKey: ["admin", "session"] });
    };

    const handleLogin = () => {
      setIdentityError("");
      queryClient.invalidateQueries({ queryKey: ["admin", "session"] });
    };

    const handleLogout = () => {
      queryClient.setQueryData(["admin", "session"], {
        authenticated: false,
        user: null,
        error: "",
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "session"] });
    };

    const handleError = (error) => {
      setIdentityError(error?.message || "Could not open the admin login flow.");
    };

    const removeInitListener = onAdminIdentityEvent("init", handleInit);
    const removeLoginListener = onAdminIdentityEvent("login", handleLogin);
    const removeLogoutListener = onAdminIdentityEvent("logout", handleLogout);
    const removeErrorListener = onAdminIdentityEvent("error", handleError);

    initAdminIdentity();

    return () => {
      removeInitListener();
      removeLoginListener();
      removeLogoutListener();
      removeErrorListener();
    };
  }, [queryClient]);

  const sessionQuery = useQuery({
    queryKey: ["admin", "session"],
    queryFn: fetchAdminSession,
    enabled: isIdentityReady,
    retry: false,
  });

  const handleLogin = () => {
    setIdentityError("");
    openAdminLogin();
  };

  const handleLogout = async () => {
    await logoutAdmin();
    queryClient.setQueryData(["admin", "session"], {
      authenticated: false,
      user: null,
      error: "",
    });
  };

  const errorMessage = identityError || sessionQuery.data?.error || "";

  return (
    <>
      <Helmet>
        <title>Admin Workspace | Move Rentals</title>
        <meta
          name="description"
          content="Protected admin workspace for editing Move Rentals fleet metadata."
        />
      </Helmet>

      {!isIdentityReady && (
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-graphite/50 bg-arsenic p-8 text-space shadow-xl">
            Preparing admin login...
          </div>
        </div>
      )}

      {isIdentityReady && sessionQuery.isLoading && (
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-graphite/50 bg-arsenic p-8 text-space shadow-xl">
            Checking admin access...
          </div>
        </div>
      )}

      {isIdentityReady && sessionQuery.isError && (
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-xl rounded-3xl border border-red-500/40 bg-red-500/10 p-8 shadow-xl">
            <FaExclamationTriangle className="text-3xl text-red-300" />
            <h1 className="mt-4 text-2xl font-extrabold text-cloud">
              Could Not Verify Admin Access
            </h1>
            <p className="mt-2 text-space">
              {sessionQuery.error?.message || "Unknown error"}
            </p>
          </div>
        </div>
      )}

      {isIdentityReady &&
        !sessionQuery.isLoading &&
        !sessionQuery.isError &&
        !sessionQuery.data?.authenticated && (
          <LoginCard errorMessage={errorMessage} onLogin={handleLogin} />
        )}

      {isIdentityReady &&
        !sessionQuery.isLoading &&
        !sessionQuery.isError &&
        sessionQuery.data?.authenticated && (
          <AdminPage
            adminUser={sessionQuery.data.user}
            getAuthToken={getAdminToken}
            onLogout={handleLogout}
          />
        )}
    </>
  );
}

export default AdminWorkspacePage;
