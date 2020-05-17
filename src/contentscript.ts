import { getConfig } from './model';

!(async function () {
  var injectedCode = `
    window._injectedConfig = ${JSON.stringify(await getConfig())}
  `;
  let script = document.createElement('script');
  script.textContent = injectedCode;
  (document.head || document.documentElement).appendChild(script);
  script.remove();

  script = document.createElement('script');
  script.src = chrome.runtime.getURL('inject.js');
  script.onload = function () {
    script.parentNode?.removeChild(script);
  };
  (document.head || document.documentElement).appendChild(script);
})();
