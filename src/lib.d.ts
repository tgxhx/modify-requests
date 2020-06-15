declare global {
  interface Window {
    _injectedConfig?: ConfigModel;
  }
}

interface ModifiedUrlModel {
  name: string;
  url: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  body?: string;
  enable: boolean;
}

interface ConfigModel {
  modifiedUrls?: Array<ModifiedUrlModel>;
}
