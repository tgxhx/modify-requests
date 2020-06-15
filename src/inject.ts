function isJsonText(text?: string) {
  if (!text) return false;
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
}

// @ts-ignore
const injectedConfig: ConfigModel = window._injectedConfig || {};
const { modifiedUrls = [] } = injectedConfig;

const rawOpen = XMLHttpRequest.prototype.open;
const rawFetch = window.fetch;

function log(msg?: string) {
  if (!msg) return;
  const json = isJsonText(msg) ? JSON.parse(msg) : msg;
  console.log(`%c modified response: `, 'background: #222; color: #bada55', json);
}

function detectUrlMatching(targetUrl: string) {
  let modifiedBody: string | undefined;
  let _enable = false;
  const matched = modifiedUrls.some(({ url, body, enable }) => {
    if (targetUrl.includes(url)) {
      modifiedBody = body;
      _enable = enable;
      return true;
    }
    return false;
  });
  return {
    matched,
    modifiedBody,
    enable: _enable,
  };
}

XMLHttpRequest.prototype.open = function (...args: any) {
  rawOpen.apply(this, args);
  const { matched, modifiedBody, enable } = detectUrlMatching(args[1]);
  if (matched && enable) {
    this.addEventListener('readystatechange', () => {
      if (this.readyState === 4) {
        if (modifiedBody && isJsonText(modifiedBody)) {
          Object.defineProperty(this, 'responseText', {
            writable: true,
            value: modifiedBody,
          });
          log(modifiedBody);
        }
      }
    });
  }
};

window.fetch = function (...args: [RequestInfo, (RequestInit | undefined)?]) {
  const url = typeof args[0] === 'string' ? args[0] : args[0].url;
  const { matched, modifiedBody, enable } = detectUrlMatching(url);
  if (matched && enable) {
    if (args?.[1]?.body) {
      try {
        const json = JSON.parse(args[1].body.toString());
        args[1].body = JSON.stringify(json);
      } catch (e) {
        throw e;
      }
    }
    return rawFetch.apply(this, args).then((res) => {
      if (modifiedBody && isJsonText(modifiedBody)) {
        const result = JSON.parse(modifiedBody);
        res.json = () => Promise.resolve(result);
        log(url);
        log(modifiedBody);
      }
      return res;
    });
  } else {
    return rawFetch.apply(this, args);
  }
};
