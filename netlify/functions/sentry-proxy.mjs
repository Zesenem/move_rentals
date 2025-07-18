export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const envelope = event.body;
    const [header] = envelope.split('\n');
    const { dsn } = JSON.parse(header);

    if (!dsn) {
      return { statusCode: 400, body: 'DSN not found in Sentry envelope.' };
    }

    const projectId = dsn.substring(dsn.lastIndexOf('/') + 1);
    const sentryHost = dsn.substring(dsn.indexOf('@') + 1, dsn.lastIndexOf('/'));

    if (!sentryHost.endsWith('sentry.io')) {
        return { statusCode: 403, body: 'Invalid Sentry host.' };
    }

    const url = `https://${sentryHost}/api/${projectId}/envelope/`;

    await fetch(url, {
      method: 'POST',
      body: envelope,
    });

    return { statusCode: 200 };

  } catch (error) {
    console.error('Sentry proxy error:', error);
    return { statusCode: 500, body: 'Error forwarding to Sentry.' };
  }
};