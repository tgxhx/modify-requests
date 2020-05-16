import { getUrl } from './config';

async function initEventListener() {
  const testUrl = await getUrl<string>();
  console.log('testUrl', testUrl);
  chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      if (details.url === testUrl) {
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
      if (details.url === testUrl) {
        for (let i = 0; i < details.responseHeaders!.length; i++) {
          if (details.responseHeaders![i].name === 'Server') {
            details.responseHeaders![i].value += '1';
          }
        }
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
