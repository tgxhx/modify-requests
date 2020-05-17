import { initConfig, getConfig } from './model';

initConfig();

async function initEventListener() {
  const config = (await getConfig()) || {};
  const { modifiedUrls = [] } = config;
  chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      if (modifiedUrls.some(({ url }) => details.url.includes(url))) {
        for (let i = 0; i < details.requestHeaders!.length; i++) {
          if (details.requestHeaders![i].name === 'Referer') {
            details.requestHeaders!.splice(i, 1);
            break;
          }
        }
      }
      return {
        requestHeaders: details.requestHeaders,
      };
    },
    {
      urls: ['<all_urls>'],
    },
    ['blocking', 'requestHeaders', 'extraHeaders']
  );

  chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
      if (modifiedUrls.some(({ url }) => details.url.includes(url))) {
        for (let i = 0; i < details.responseHeaders!.length; i++) {
          /*if (details.responseHeaders![i].name === 'access-control-allow-origin') {
            details.responseHeaders![i].value = '*';
          }*/
        }
        details.responseHeaders?.push({
          name: 'test-hader',
          value: '111',
        });
      }
      return {
        responseHeaders: details.responseHeaders,
      };
    },
    {
      urls: ['<all_urls>'],
    },
    ['blocking', 'responseHeaders', 'extraHeaders']
  );
}

initEventListener();

chrome.browserAction.setPopup({ popup: '' });

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'options.html' });
});
