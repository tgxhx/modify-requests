export function isJsonText(text?: string) {
  if (!text) return false;
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
}

export function arrayBufferToString(buf: ArrayBuffer) {
  return new TextDecoder().decode(buf);
}

export function stringToArrayBuffer(str: string) {
  return new TextEncoder().encode(str);
}
