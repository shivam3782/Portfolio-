/** Keep Tab within a modal, including browsers that otherwise focus browser chrome. */
export function trapFocus(event) {
  if (event.key !== "Tab") return;
  const elements = [
    ...event.currentTarget.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]',
    ),
  ].filter((element) => element.getClientRects().length);
  if (!elements.length) return;
  event.preventDefault();
  const current = elements.indexOf(document.activeElement);
  elements[
    (current + (event.shiftKey ? -1 : 1) + elements.length) % elements.length
  ].focus();
}
