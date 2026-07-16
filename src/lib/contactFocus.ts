export const CONTACT_EDITING_CHANGE_EVENT = 'contact-editing-change';

const MOBILE_KEYBOARD_HEIGHT_THRESHOLD = 80;
const VIEWPORT_WIDTH_TOLERANCE = 2;

let contactEditing = false;

export const isEditableElement = (element: Element | null) =>
  element instanceof HTMLInputElement ||
  element instanceof HTMLTextAreaElement ||
  element instanceof HTMLSelectElement ||
  element?.getAttribute('contenteditable') === 'true';

export const isContactEditableElement = (element: Element | null) =>
  isEditableElement(element) && Boolean(element?.closest('#contact form'));

export const isCoarsePointerMobile = () =>
  window.matchMedia('(pointer: coarse)').matches &&
  window.matchMedia(
    '(max-width: 767px), (max-width: 1024px) and (max-height: 500px) and (orientation: landscape)',
  ).matches;

export const getViewportOrientation = () => {
  const type = window.screen.orientation?.type;
  if (type?.startsWith('landscape')) return 'landscape';
  if (type?.startsWith('portrait')) return 'portrait';
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

type KeyboardResizeSnapshot = {
  width: number;
  visualHeight: number;
  orientation: string;
};

export const isHeightOnlyContactKeyboardResize = (
  previous: KeyboardResizeSnapshot,
  current: KeyboardResizeSnapshot,
  editableFocused = contactEditing,
) =>
  editableFocused &&
  isCoarsePointerMobile() &&
  Math.abs(current.width - previous.width) <= VIEWPORT_WIDTH_TOLERANCE &&
  current.orientation === previous.orientation &&
  Math.abs(current.visualHeight - previous.visualHeight) >= MOBILE_KEYBOARD_HEIGHT_THRESHOLD;

export const isContactEditing = () => contactEditing;

export const setContactEditing = (active: boolean) => {
  if (contactEditing === active) return;
  contactEditing = active;
  document.documentElement.toggleAttribute('data-contact-editing', active);
  document.dispatchEvent(
    new CustomEvent(CONTACT_EDITING_CHANGE_EVENT, { detail: { active } }),
  );
};
