const SENTRY_KEY = 'bb42f8b68dfc4a6eabd26bae674eab6f';
const SENTRY_APP = '119236';
export const SENTRY_URL = `https://${SENTRY_KEY}@sentry.io/${SENTRY_APP}`;

export function logException(ex, context) {
  Raven.captureException(ex, {
    extra: context
  });

  /*eslint no-console:0*/
  window && window.console && console.error && console.error(ex);
}
