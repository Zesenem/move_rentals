let sentryPromise;

const loadSentry = () => {
  if (!sentryPromise) {
    sentryPromise = import("@sentry/react").then((Sentry) => {
      Sentry.init({
        dsn: "https://63e09e83dc19c7365dd42385009bc409@o4509673502736384.ingest.de.sentry.io/4509673504505936",
        tunnel: "/.netlify/functions/sentry-proxy",
      });
      return Sentry;
    });
  }

  return sentryPromise;
};

export const reportError = async (error, componentStack) => {
  try {
    const Sentry = await loadSentry();
    Sentry.captureException(error, {
      contexts: componentStack ? { react: { componentStack } } : undefined,
    });
  } catch (monitoringError) {
    console.error("Could not report the application error:", monitoringError);
  }
};
