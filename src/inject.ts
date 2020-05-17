// @ts-ignore
const injectedConfig: ConfigModel = window._injectedConfig;
const { modifiedUrls = [] } = injectedConfig;

const rawOpen = XMLHttpRequest.prototype.open;

class NewXMLHttpRequest extends XMLHttpRequest {
  private body: string | undefined | null;
  constructor() {
    super();
  }

  readyStateChangeListener(this: any) {
    if (this.readyState === 4) {
      if (this.body) {
        Object.defineProperty(this, 'responseText', { writable: true });
        log(this.body);
        this.responseText = this.body;
        this.body = null;
      }
    }
  }

  async open(this: NewXMLHttpRequest, ...args: any) {
    rawOpen.apply(this, args);
    const matched = modifiedUrls.some(({ url, body }) => {
      if (args[1].includes(url)) {
        this.body = body;
        return true;
      }
      return false;
    });
    if (matched) {
      this.addEventListener('readystatechange', this.readyStateChangeListener);
    }
  }
}

// @ts-ignore
window.fetch = null;
window.XMLHttpRequest = NewXMLHttpRequest;

function log(msg: string) {
  let json = msg;
  try {
    json = JSON.parse(msg);
  } catch (e) {}
  console.log('modified response: ', json);
}
