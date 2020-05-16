const rawOpen = XMLHttpRequest.prototype.open;

interface NewXMLHttpRequest extends XMLHttpRequest {
  responseText: XMLHttpRequest['responseText'];
}

class newXMLHttpRequest extends XMLHttpRequest {
  constructor() {
    super();
  }

  readyStateChangeListener(
    this: NewXMLHttpRequest,
    response: XMLHttpRequestEventMap['readystatechange']
  ) {
    if (this.readyState === 4) {
      const originResponse = (response?.target as XMLHttpRequest)?.responseText;
      let modifyedResponse;
      if (originResponse) {
        try {
          const result = JSON.parse(originResponse);
          modifyedResponse = JSON.stringify(result);
        } catch (e) {}
      }
      if (modifyedResponse) {
        Object.defineProperty(this, 'responseText', { writable: true });
        console.log('modified response: ', modifyedResponse);
        this.responseText = modifyedResponse;
      }
    }
  }

  async open(...args: any) {
    rawOpen.apply(this, args);
    if (
      // @ts-ignore
      window._injectedConfig?.testUrl?.includes(args[1])
    ) {
      this.addEventListener('readystatechange', this.readyStateChangeListener);
    }
  }
}

// @ts-ignore
window.fetch = null;
window.XMLHttpRequest = newXMLHttpRequest;
