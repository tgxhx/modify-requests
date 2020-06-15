import { getConfig } from './model';

!(async function () {
  const injectedCode = `
   window._injectedConfig = ${JSON.stringify(await getConfig())}
  `;
  const script = document.createElement('script');
  script.textContent = injectedCode;
  (document.head || document.documentElement).appendChild(script);
  script.onload = function () {
    script.parentNode?.removeChild(script);
  };

  const inject = document.createElement('script');
  inject.src = chrome.runtime.getURL('inject.js');
  (document.head || document.documentElement).appendChild(inject);
  inject.onload = function () {
    inject.parentNode?.removeChild(inject);
  };
})();
