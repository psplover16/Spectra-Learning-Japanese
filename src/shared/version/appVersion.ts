/* global __APP_VERSION__ */

const fallbackAppVersion = '0.0.0-dev';

export const appVersion =
  typeof __APP_VERSION__ === 'string' && __APP_VERSION__.trim().length > 0 ? __APP_VERSION__ : fallbackAppVersion;
