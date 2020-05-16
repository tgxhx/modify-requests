import { storageGet } from './helper';

export async function getUrl<T>(): Promise<T> {
  return (await storageGet('test-url'))['test-url'];
}
