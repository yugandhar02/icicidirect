// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

loadScript('https://icici-securities.allincall.in/files/deploy/embed_chatbot_11.js?version=1.1');

loadScript('https://assets.adobedtm.com/64c36731dbac/390f7bab5b74/launch-285ee83071cc-development.min.js', { async: true });
