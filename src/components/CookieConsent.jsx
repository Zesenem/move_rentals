import { useState } from "react";
import { Link } from "react-router-dom";
import { grantAnalyticsConsent, revokeAnalyticsConsent } from "../services/analytics.js";

const CONSENT_KEY = "move-rentals-cookie-consent";

const readConsent = () => {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
};

function CookieConsent() {
  const [consent, setConsent] = useState(readConsent);
  const [isVisible, setIsVisible] = useState(!consent);

  const saveConsent = (value) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Keep the current-page choice even when storage is unavailable.
    }

    setConsent(value);
    setIsVisible(false);

    if (value === "accepted") {
      grantAnalyticsConsent();
    } else {
      revokeAnalyticsConsent();
    }
  };

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => setIsVisible(true)}
        className="fixed right-4 bottom-4 z-40 rounded-full border border-graphite/60 bg-arsenic px-3 py-2 text-xs font-bold text-space shadow-lg transition-colors hover:text-cloud"
        aria-label="Manage cookie preferences"
      >
        Cookies
      </button>
    );
  }

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-graphite/60 bg-phantom/95 p-4 shadow-2xl backdrop-blur sm:p-5"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-space">
          We use optional analytics cookies to understand how visitors use the site. Choose
          whether to allow them; essential site features work either way.{" "}
          <Link to="/privacy-policy" className="font-semibold text-cloud underline underline-offset-2">
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 flex-col gap-2 min-[420px]:flex-row">
          <button
            type="button"
            onClick={() => saveConsent("rejected")}
            className="min-h-11 rounded-xl border border-graphite/70 px-4 py-2 text-sm font-bold text-steel transition-colors hover:border-cloud hover:text-cloud"
          >
            Reject optional
          </button>
          <button
            type="button"
            onClick={() => saveConsent("accepted")}
            className="min-h-11 rounded-xl bg-cloud px-4 py-2 text-sm font-extrabold text-phantom transition-colors hover:bg-cloud/90"
          >
            Accept analytics
          </button>
        </div>
      </div>
      {consent && (
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-3 text-xl text-space hover:text-cloud"
          aria-label="Close cookie preferences"
        >
          ×
        </button>
      )}
    </aside>
  );
}

export default CookieConsent;
