export const storageKey = 'MODIFY_REQUESTS_CONFIG_KEY';

const initialConfig: ConfigModel = {
  modifiedUrls: [],
};

export function storageGet(key: string): Promise<{ [p: string]: any }> {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => resolve(result[key]));
  });
}

export function storageSet(obj: { [x: string]: any }) {
  return new Promise((resolve) => {
    chrome.storage.local.set(obj, () => resolve());
  });
}

export function getConfig(): Promise<ConfigModel> {
  return storageGet(storageKey);
}

export async function setConfig(data: ConfigModel) {
  const prevConfig = await getConfig();
  const nextData = {
    ...prevConfig,
    ...data,
  };
  return await storageSet({
    [storageKey]: nextData,
  });
}

export function clearConfig() {
  storageSet(initialConfig);
}

export async function initConfig() {
  const config = await getConfig();
  if (!config) {
    setConfig(initialConfig);
  }
}
