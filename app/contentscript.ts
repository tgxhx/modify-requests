import { getUrl } from './config';

!(async function () {
  var actualCode = `
    window._injectedConfig = ${JSON.stringify({
      testUrl: await getUrl<string>(),
    })}
  `;
  var script = document.createElement('script');
  script.textContent = actualCode;
  (document.head || document.documentElement).appendChild(script);
  script.remove();

  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('inject.js');
  s.onload = function () {
    s.parentNode!.removeChild(s);
  };
  (document.head || document.documentElement).appendChild(s);
  console.log('content script');
})();
