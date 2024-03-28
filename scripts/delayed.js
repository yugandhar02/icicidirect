// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

function getEnvType(hostname = window.location.hostname) {
  const fqdnToEnvType = {
    'main--icicidirect--aemsites.hlx.page': 'preview',
    'main--icicidirect--aemsites.hlx.live': 'live',
  };
  return fqdnToEnvType[hostname] || 'dev';
}

loadScript('https://icici-securities.allincall.in/files/deploy/embed_chatbot_11.js?version=1.1');
loadScript('/scripts/cookie-script.js');

(function loadAdobeLaunch() {
  const adobeLaunchSrc = {
    dev: 'https://assets.adobedtm.com/64c36731dbac/390f7bab5b74/launch-285ee83071cc-development.min.js',
    preview: 'https://assets.adobedtm.com/64c36731dbac/390f7bab5b74/launch-285ee83071cc-development.min.js',
    live: 'https://assets.adobedtm.com/64c36731dbac/390f7bab5b74/launch-285ee83071cc-development.min.js',
  };
  loadScript(adobeLaunchSrc[getEnvType()], { async: true });
}());
