import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { FaExclamationTriangle, FaLock } from "react-icons/fa";

import Button from "../components/Button";
import AdminPage from "./admin/AdminPage.jsx";
import {
  acceptAdminInvite,
  fetchAdminSession,
  loginAdmin,
  logoutAdmin,
  processAdminAuthCallback,
  requestAdminPasswordRecovery,
  setAdminPassword,
} from "../services/adminAuth.js";

const inputClassName =
  "w-full rounded-xl border border-graphite/60 bg-phantom px-4 py-3 text-sm text-steel outline-none transition-colors focus:border-cloud";

const ErrorNotice = ({ message }) =>
  message ? (
    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
      {message}
    </div>
  ) : null;

const LoginForm = ({ onSubmit, onForgotPassword, isSubmitting, errorMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <input
        type="email"
        required
        autoComplete="username"
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={inputClassName}
      />
      <input
        type="password"
        required
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className={inputClassName}
      />
      <ErrorNotice message={errorMessage} />
      <Button type="submit" disabled={isSubmitting} className="w-full justify-center py-3">
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
      <button
        type="button"
        onClick={onForgotPassword}
        className="block w-full text-center text-sm text-space hover:text-cloud"
      >
        Forgot your password?
      </button>
    </form>
  );
};

const RecoveryRequestForm = ({ onSubmit, onCancel, isSubmitting, statusMessage, errorMessage }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <p className="text-sm text-space">
        Enter your admin email and we'll send you a password reset link.
      </p>
      <input
        type="email"
        required
        autoComplete="username"
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={inputClassName}
      />
      {statusMessage && <p className="text-sm text-emerald-400">{statusMessage}</p>}
      <ErrorNotice message={errorMessage} />
      <Button type="submit" disabled={isSubmitting} className="w-full justify-center py-3">
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </Button>
      <button
        type="button"
        onClick={onCancel}
        className="block w-full text-center text-sm text-space hover:text-cloud"
      >
        Back to login
      </button>
    </form>
  );
};

const LoginCard = ({
  view,
  onLogin,
  onShowRecoveryForm,
  onRequestRecovery,
  onCancelRecovery,
  isSubmitting,
  errorMessage,
  recoveryStatusMessage,
}) => (
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
          <h1 className="mt-1 text-3xl font-extrabold">
            {view === "recovery" ? "Reset Password" : "Admin Login"}
          </h1>
        </div>
      </div>

      <p className="mt-6 text-space">
        {view === "recovery"
          ? "We'll email you a link to reset your password."
          : "Sign in with the invited admin account to edit fleet metadata. This route is not public."}
      </p>

      {view === "recovery" ? (
        <RecoveryRequestForm
          onSubmit={onRequestRecovery}
          onCancel={onCancelRecovery}
          isSubmitting={isSubmitting}
          statusMessage={recoveryStatusMessage}
          errorMessage={errorMessage}
        />
      ) : (
        <LoginForm
          onSubmit={onLogin}
          onForgotPassword={onShowRecoveryForm}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}
    </div>
  </div>
);

const SetPasswordCard = ({ title, description, onSubmit, isSubmitting, errorMessage }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setValidationError("");
    onSubmit(password);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-graphite/50 bg-arsenic p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold text-cloud">{title}</h1>
        <p className="mt-4 text-space">{description}</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            required
            autoComplete="new-password"
            placeholder="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
          />
          <input
            type="password"
            required
            autoComplete="new-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={inputClassName}
          />
          <ErrorNotice message={validationError || errorMessage} />
          <Button type="submit" disabled={isSubmitting} className="w-full justify-center py-3">
            {isSubmitting ? "Saving..." : "Set Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

function AdminWorkspacePage() {
  const queryClient = useQueryClient();
  const [isCallbackProcessed, setIsCallbackProcessed] = useState(false);
  const [pendingCallback, setPendingCallback] = useState(null);
  const [authView, setAuthView] = useState("login");
  const [authError, setAuthError] = useState("");
  const [recoveryStatusMessage, setRecoveryStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    processAdminAuthCallback()
      .then((result) => {
        if (!isMounted) {
          return;
        }

        if (result?.type === "invite" && result.token) {
          setPendingCallback({ type: "invite", token: result.token });
        } else if (result?.type === "recovery") {
          setPendingCallback({ type: "recovery" });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAuthError(error?.message || "Could not process the authentication link.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCallbackProcessed(true);
          queryClient.invalidateQueries({ queryKey: ["admin", "session"] });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [queryClient]);

  const sessionQuery = useQuery({
    queryKey: ["admin", "session"],
    queryFn: fetchAdminSession,
    enabled: isCallbackProcessed && !pendingCallback,
    retry: false,
  });

  const handleLogin = async ({ email, password }) => {
    setAuthError("");
    setIsSubmitting(true);

    try {
      await loginAdmin(email, password);
      queryClient.invalidateQueries({ queryKey: ["admin", "session"] });
    } catch (error) {
      setAuthError(error?.message || "Could not sign in with those credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestRecovery = async (email) => {
    setAuthError("");
    setRecoveryStatusMessage("");
    setIsSubmitting(true);

    try {
      await requestAdminPasswordRecovery(email);
      setRecoveryStatusMessage("Check your email for a password reset link.");
    } catch (error) {
      setAuthError(error?.message || "Could not send the password reset email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetInvitePassword = async (password) => {
    setAuthError("");
    setIsSubmitting(true);

    try {
      await acceptAdminInvite(pendingCallback.token, password);
      setPendingCallback(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "session"] });
    } catch (error) {
      setAuthError(error?.message || "Could not set your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetRecoveryPassword = async (password) => {
    setAuthError("");
    setIsSubmitting(true);

    try {
      await setAdminPassword(password);
      setPendingCallback(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "session"] });
    } catch (error) {
      setAuthError(error?.message || "Could not set your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    queryClient.setQueryData(["admin", "session"], {
      authenticated: false,
      user: null,
      error: "",
    });
  };

  const errorMessage = authError || sessionQuery.data?.error || "";

  return (
    <>
      <Helmet>
        <title>Admin Workspace | Move Rentals</title>
        <meta
          name="description"
          content="Protected admin workspace for editing Move Rentals fleet metadata."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {!isCallbackProcessed && (
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-graphite/50 bg-arsenic p-8 text-space shadow-xl">
            Preparing admin login...
          </div>
        </div>
      )}

      {isCallbackProcessed && pendingCallback?.type === "invite" && (
        <SetPasswordCard
          title="Set Your Password"
          description="Choose a password to finish setting up your admin account."
          onSubmit={handleSetInvitePassword}
          isSubmitting={isSubmitting}
          errorMessage={authError}
        />
      )}

      {isCallbackProcessed && pendingCallback?.type === "recovery" && (
        <SetPasswordCard
          title="Reset Your Password"
          description="Choose a new password for your admin account."
          onSubmit={handleSetRecoveryPassword}
          isSubmitting={isSubmitting}
          errorMessage={authError}
        />
      )}

      {isCallbackProcessed && !pendingCallback && sessionQuery.isLoading && (
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-graphite/50 bg-arsenic p-8 text-space shadow-xl">
            Checking admin access...
          </div>
        </div>
      )}

      {isCallbackProcessed && !pendingCallback && sessionQuery.isError && (
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-xl rounded-3xl border border-red-500/40 bg-red-500/10 p-8 shadow-xl">
            <FaExclamationTriangle className="text-3xl text-red-300" />
            <h1 className="mt-4 text-2xl font-extrabold text-cloud">
              Could Not Verify Admin Access
            </h1>
            <p className="mt-2 text-space">{sessionQuery.error?.message || "Unknown error"}</p>
          </div>
        </div>
      )}

      {isCallbackProcessed &&
        !pendingCallback &&
        !sessionQuery.isLoading &&
        !sessionQuery.isError &&
        !sessionQuery.data?.authenticated && (
          <LoginCard
            view={authView}
            onLogin={handleLogin}
            onShowRecoveryForm={() => {
              setAuthError("");
              setRecoveryStatusMessage("");
              setAuthView("recovery");
            }}
            onRequestRecovery={handleRequestRecovery}
            onCancelRecovery={() => {
              setAuthError("");
              setRecoveryStatusMessage("");
              setAuthView("login");
            }}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            recoveryStatusMessage={recoveryStatusMessage}
          />
        )}

      {isCallbackProcessed &&
        !pendingCallback &&
        !sessionQuery.isLoading &&
        !sessionQuery.isError &&
        sessionQuery.data?.authenticated && (
          <AdminPage adminUser={sessionQuery.data.user} onLogout={handleLogout} />
        )}
    </>
  );
}

export default AdminWorkspacePage;
