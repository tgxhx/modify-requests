export function storageGet(key: string): Promise<{ [p: string]: any }> {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => resolve(result));
  });
}

export function storageSet(obj: { [x: string]: any }) {
  return new Promise((resolve) => {
    chrome.storage.local.set(obj, () => resolve());
  });
}
