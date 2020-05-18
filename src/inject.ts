// @ts-ignore
const injectedConfig: ConfigModel = window._injectedConfig || {};
const { modifiedUrls = [] } = injectedConfig;

const rawOpen = XMLHttpRequest.prototype.open;
const rawFetch = window.fetch;

function isJsonText(text: string) {
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
}

function log(msg: string) {
  const json = isJsonText(msg) ? JSON.parse(msg) : msg;
  console.log('modified response: ', json);
}

function detectUrlMatching(targetUrl: string): [boolean, string | undefined] {
  let modifiedBody: string | undefined = void 0;
  const matched = modifiedUrls.some(({ url, body }) => {
    if (targetUrl.includes(url)) {
      modifiedBody = body;
      return true;
    }
    return false;
  });
  return [matched, modifiedBody];
}

XMLHttpRequest.prototype.open = function (...args: any) {
  rawOpen.apply(this, args);
  const [matched, modifiedBody] = detectUrlMatching(args[1]);
  if (matched) {
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
  return rawFetch.apply(this, args).then((res) => {
    const [matched, modifiedBody] = detectUrlMatching(res.url);
    if (matched) {
      if (modifiedBody && isJsonText(modifiedBody)) {
        const result = JSON.parse(modifiedBody);
        res.json = () => Promise.resolve(result);
        log(modifiedBody);
      }
      return res;
    }
    return res;
  });
};
