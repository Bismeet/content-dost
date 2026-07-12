import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function getLenisInstance(): Lenis | null {
  return lenisInstance;
}

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}
